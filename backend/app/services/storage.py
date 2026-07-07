from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings


def save_upload(file: UploadFile | None) -> str | None:
    if file is None or not file.filename:
        return None

    suffix = Path