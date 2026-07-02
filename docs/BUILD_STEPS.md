# CivicMind AI Build Steps

## Step 1: Backend Foundation

Files:

- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/app/db/session.py`
- `backend/app/models/*`

What this gives you:

- FastAPI application.
- CORS setup.
- Database session.
- SQLAlchemy models for users, issues, comments.
- `/health` endpoint.

Run:

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Step 2: Authentication

Files:

- `backend/app/core/security.py`
- `backend/app/api/v1/routes/auth.py`
- `backend/app/api/deps.py`

What this gives you:

- Register.
- Login.
- Password hashing.
- JWT access tokens.
- Current-user dependency.

Endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/users/me
```

## Step 3: Issue Reporting

Files:

- `backend/app/api/v1/routes/issues.py`
- `backend/app/services/storage.py`
- `backend/app/services/ai_classifier.py`

What this gives you:

- Multipart issue upload.
- Local image storage.
- Rule-based category prediction.
- Issue CRUD foundation.

Endpoint:

```text
POST /api/v1/issues
```

## Step 4: Duplicate Detection

Files:

- `backend/app/services/duplicate_detector.py`

Logic:

- Compare category.
- Compare GPS distance.
- Compare description similarity.
- Link duplicate reports using `duplicate_of_id`.

Upgrade later:

- Replace text similarity with embeddings.
- Replace simple distance checks with PostGIS queries.

## Step 5: Priority Engine

Files:

- `backend/app/services/priority_engine.py`

Logic:

- Water leakage starts urgent.
- Potholes, fallen trees, and broken streetlights rank high.
- Strong AI confidence increases priority.
- Older duplicate clusters increase priority.

Upgrade later:

- Add school/hospital/road proximity.
- Add department SLA rules.
- Train a ranking model from historical resolution data.

## Step 6: Frontend Workflows

Files:

- `frontend/src/App.jsx`
- `frontend/src/api/client.js`
- `frontend/src/pages/*`
- `frontend/src/components/*`

Pages:

- Login.
- Register.
- Dashboard.
- Report issue.
- Map.
- Analytics.

Run:

```powershell
cd frontend
npm install
npm run dev
```

## Step 7: Docker Development

Files:

- `docker-compose.yml`
- `backend/Dockerfile`
- `.env.example`

Run database:

```powershell
docker compose up -d db
```

Run API in Docker:

```powershell
docker compose up --build backend
```

## Step 8: Next Production Improvements

- Add Alembic migrations.
- Add roles and department management.
- Add image validation and virus scanning.
- Store images in S3.
- Use PostGIS for geospatial indexing.
- Add tests for auth, issues, duplicates, analytics.
- Add GitHub Actions.

