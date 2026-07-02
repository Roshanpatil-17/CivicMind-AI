# CivicMind AI

Intelligent urban issue detection and management platform.

Citizens can report civic issues with location, description, and photos. The backend classifies reports, detects likely duplicates, calculates priority, and exposes data for dashboards, maps, and analytics.

## Architecture

```text
React + Leaflet frontend
        |
        v
FastAPI REST API
        |
        +-- PostgreSQL/PostGIS-ready relational data
        +-- Local/S3-ready image storage
        +-- AI services for category, priority, duplicate detection
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full design.

## Local Setup

1. Copy environment values.

   ```powershell
   Copy-Item .env.example .env
   ```

2. Start the database.

   ```powershell
   docker compose up -d db
   ```

3. Run the backend.

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. Run the frontend.

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

## API

Backend health check:

```text
GET http://localhost:8000/health
```

Interactive API docs:

```text
http://localhost:8000/docs
```

## Step-by-step Build Order

1. Backend foundation: settings, database, models, auth.
2. Issue reporting: upload image, classify issue, save report.
3. Duplicate detection: compare distance and description similarity.
4. Priority engine: score urgency based on category, duplicates, confidence, and age.
5. Frontend workflows: login, register, report issue, map, dashboard, analytics.
6. AI upgrade: replace rule-based stubs with YOLO and NLP models.
7. Production deployment: object storage, managed database, CI/CD, monitoring.

