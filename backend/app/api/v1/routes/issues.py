from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.issue import Issue
from app.models.user import User
from app.schemas.issue import IssueRead, IssueUpdate
from app.services.ai.detector import detect
from app.services.duplicate_detector import find_duplicate_issue
from app.services.priority_engine import calculate_priority
from app.services.storage import save_upload

router = APIRouter()


@router.post("", response_model=IssueRead, status_code=status.HTTP_201_CREATED)
def create_issue(
    title: str = Form(min_length=3, max_length=160),
    description: str = Form(min_length=3),
    latitude: float = Form(ge=-90, le=90),
    longitude: float = Form(ge=-180, le=180),
    image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Issue:

    # Save uploaded image
    image_path = save_upload(image)

    # AI Detection
    result = detect(
        title=title,
        description=description,
        image_path=image_path,
    )

    # Duplicate Detection
    duplicate = find_duplicate_issue(
        db,
        latitude=latitude,
        longitude=longitude,
        description=description,
        category=result.category,
    )

    # Priority Calculation
    priority = calculate_priority(
        result.category,
        result.confidence,
        duplicate,
    )

    # Create Database Record
    issue = Issue(
        title=title,
        description=description,
        latitude=latitude,
        longitude=longitude,
        image_path=image_path,
        category=result.category,
        confidence=result.confidence,
        priority=priority,
        reporter_id=current_user.id,
        duplicate_of_id=duplicate.id if duplicate else None,
    )

    db.add(issue)
    db.commit()
    db.refresh(issue)

    return issue


@router.get("", response_model=list[IssueRead])
def list_issues(
    status_filter: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
) -> list[Issue]:
    query = select(Issue).order_by(Issue.created_at.desc())
    if status_filter:
        query = query.where(Issue.status == status_filter)
    if category:
        query = query.where(Issue.category == category)
    return list(db.scalars(query).all())


@router.get("/{issue_id}", response_model=IssueRead)
def get_issue(issue_id: int, db: Session = Depends(get_db)) -> Issue:
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
    return issue


@router.patch("/{issue_id}", response_model=IssueRead)
def update_issue(
    issue_id: int,
    payload: IssueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Issue:
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

    if current_user.role == "citizen" and issue.reporter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(issue, field, value)

    db.commit()
    db.refresh(issue)
    return issue


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

    if current_user.role not in {"admin", "officer"} and issue.reporter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    db.delete(issue)
    db.commit()

    