from functools import lru_cache
from pathlib import Path

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "CivicMind AI"
    api_v1_prefix: str = "/api/v1"
    secret_key: str = "change-this-secret-in-production"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = "sqlite:///./civicmind.db"
    backend_cors_origins_raw: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173",
        alias="BACKEND_CORS_ORIGINS",
    )
    upload_dir_raw: str = Field(default="uploads", alias="UPLOAD_DIR")

    @computed_field
    @property
    def backend_cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins_raw.split(",") if origin.strip()]

    @computed_field
    @property
    def upload_dir(self) -> Path:
        return Path(self.upload_dir_raw)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

