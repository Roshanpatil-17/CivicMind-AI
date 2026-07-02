from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total: int
    open: int
    in_progress: int
    resolved: int
    rejected: int
    high_priority: int
    duplicate_reports: int


class CategoryCount(BaseModel):
    category: str
    count: int

