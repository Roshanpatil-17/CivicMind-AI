from fastapi import APIRouter

from app.api.v1.routes import analytics, auth, issues, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(issues.router, prefix="/issues", tags=["issues"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

