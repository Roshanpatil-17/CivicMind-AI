# CivicMind AI Architecture

## Goals

CivicMind AI is designed as a portfolio-grade civic issue management system. The first production slice should support:

- Citizen registration and login.
- Issue reporting with image, text, and GPS coordinates.
- AI-assisted category detection.
- Duplicate detection for nearby similar reports.
- Authority dashboard metrics.
- Map-ready issue data.

## System Context

```text
Citizen / Authority
        |
        v
React SPA
        |
        v
FastAPI REST API
        |
        +-- PostgreSQL database
        +-- Uploaded image storage
        +-- AI service layer
        +-- Analytics service layer
```

## Backend Layers

```text
app/main.py
  Application startup, middleware, router mounting

app/api
  HTTP routes and dependencies

app/schemas
  Request and response contracts

app/models
  SQLAlchemy database models

app/services
  AI, duplicate detection, priority, storage, analytics logic

app/core
  Settings and security utilities

app/db
  Database engine, sessions, metadata
```

Rules:

- Routes should not contain business logic beyond request handling.
- Services should be testable without HTTP.
- Schemas define public contracts; models define persistence.
- AI features begin as deterministic stubs and can later be replaced by YOLO/NLP services.

## Data Model

### users

- `id`
- `name`
- `email`
- `hashed_password`
- `role`: `citizen`, `officer`, `admin`
- `created_at`

### issues

- `id`
- `title`
- `description`
- `latitude`
- `longitude`
- `image_path`
- `status`: `open`, `in_progress`, `resolved`, `rejected`
- `priority`: `low`, `medium`, `high`, `critical`
- `category`
- `confidence`
- `reporter_id`
- `duplicate_of_id`
- `created_at`
- `updated_at`

### comments

- `id`
- `issue_id`
- `user_id`
- `comment`
- `created_at`

## API Surface

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/users/me

POST   /api/v1/issues
GET    /api/v1/issues
GET    /api/v1/issues/{issue_id}
PATCH  /api/v1/issues/{issue_id}
DELETE /api/v1/issues/{issue_id}

GET    /api/v1/analytics/summary
GET    /api/v1/analytics/categories
```

## AI Upgrade Path

Phase 1 uses rule-based classifiers so the app is immediately usable.

Phase 2 replaces internals without changing API contracts:

- Image classifier: YOLO model service.
- NLP classifier: transformer or hosted language model.
- Duplicate detection: embeddings plus geospatial distance.
- Priority engine: weighted rules, then learned ranking model.

## Deployment Shape

Development:

- Vite frontend.
- FastAPI backend.
- Docker PostgreSQL.
- Local disk uploads.

Production:

- Frontend on Vercel, Netlify, or S3/CloudFront.
- API on AWS ECS, Render, Fly.io, or EC2.
- PostgreSQL on RDS/Supabase/Neon.
- Images on S3-compatible object storage.
- GitHub Actions for tests and deployment.

