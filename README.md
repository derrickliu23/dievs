# Dievs

A rating and review platform for webtoons. Add webtoons, rate them 1–5 stars, write reviews mid-read or after finishing, and track your reading status.

## Features

- Browse and add webtoons with cover art, author, genre, and description
- Rate webtoons 1–5 stars
- Write reviews and tag your status — reading, completed, or dropped
- Average rating displayed on each webtoon's detail page

## Stack

**Frontend**
- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [React Router](https://reactrouter.com) — client-side routing
- [Axios](https://axios-http.com) — HTTP requests

**Backend**
- [FastAPI](https://fastapi.tiangolo.com) — REST API
- [SQLAlchemy](https://www.sqlalchemy.org) — ORM
- [PostgreSQL](https://www.postgresql.org) — database
- [Uvicorn](https://www.uvicorn.org) — ASGI server

## Setup

### Prerequisites

- Python 3.10+
- Node.js 20.19+
- PostgreSQL 15+

### 1. Clone the repo

```bash
git clone git@github.com:your-username/dievs.git
cd dievs
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
DATABASE_URL=postgresql://localhost/dievs
```

Create the database:
```bash
createdb dievs
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Project structure

```
dievs/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WebtoonCard.jsx    # webtoon grid card
│   │   │   ├── WebtoonForm.jsx    # add webtoon form
│   │   │   └── ReviewForm.jsx     # add review form
│   │   ├── pages/
│   │   │   ├── Home.jsx           # webtoon browsing page
│   │   │   └── WebtoonDetail.jsx  # webtoon detail and reviews
│   │   ├── api.js                 # axios instance
│   │   └── App.jsx                # routing
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI app, CORS, router registration
│   │   ├── database.py            # PostgreSQL connection and session management
│   │   ├── models.py              # Webtoon and Review table definitions
│   │   ├── schemas.py             # request/response shape validation
│   │   └── routers/
│   │       ├── webtoons.py        # CRUD routes for webtoons
│   │       └── reviews.py         # CRUD routes for reviews
│   └── requirements.txt
└── README.md
```

## API routes

| Method | Route | Description |
|---|---|---|
| GET | `/webtoons/` | Get all webtoons |
| GET | `/webtoons/{id}` | Get a single webtoon |
| POST | `/webtoons/` | Add a new webtoon |
| DELETE | `/webtoons/{id}` | Delete a webtoon |
| GET | `/reviews/?webtoon_id={id}` | Get all reviews for a webtoon |
| POST | `/reviews/` | Add a new review |
| DELETE | `/reviews/{id}` | Delete a review |