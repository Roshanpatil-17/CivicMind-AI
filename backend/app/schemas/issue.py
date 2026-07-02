from datetime import datetime

from pydantic import BaseModel, Field


class IssueRead(BaseModel):
    id: int
    title: str
    description: str
    latitude: float
    longitude: float
    image_path: str | None
    status: str
    priority: str
    category: str | None
    confidence: float
    reporter_id: int
    duplicate_of_id: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class IssueUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=160)
    description: str | None = Field(default=None, min_length=3)
    status: str | None = Field(default=None, pattern="^(open|in_progress|resolved|rejected)$")
    priority: str | None = Field(default=None, pattern="^(low|medium|high|critical)$")
    category: str | None = Field(default=None, max_length=80)

