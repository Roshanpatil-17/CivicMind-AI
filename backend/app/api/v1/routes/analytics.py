from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.issue import Issue
from app.schemas.analytics import AnalyticsSummary, CategoryCount

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
def summary(db: Session = Depends(get_db)) -> AnalyticsSummary:
    statuses = dict(db.execute(select(Issue.status, func.count()).group_by(Issue.status)).all())

    return AnalyticsSummary(
        total=db.scalar(select(func.count(Issue.id))) or 0,
        open=statuses.get("open", 0),
        in_progress=statuses.get("in_progress", 0),
        resolved=statuses.get("resolved", 0),
        rejected=statuses.get("rejected", 0),
        high_priority=db.scalar(select(func.count(Issue.id)).where(Issue.priority.in_(["high", "critical"]))) or 0,
        duplicate_reports=db.scalar(select(func.count(Issue.id)).where(Issue.duplicate_of_id.is_not(None))) or 0,
    )


@router.get("/categories", response_model=list[CategoryCount])
def categories(db: Session = Depends(get_db)) -> list[CategoryCount]:
    rows = db.execute(
        select(Issue.category, func.count(Issue.id))
        .group_by(Issue.category)
        .order_by(func.count(Issue.id).desc())
    ).all()
    return [CategoryCount(category=category or "unknown", count=count) for category, count in rows]

