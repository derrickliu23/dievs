# Dievs

A rating and review platform for webtoons. Search for titles via AniList, rate them with a customizable rating system, track your chapter progress, log notes as you read, and discover recommendations based on your taste.

## Features

- **Search & add** — live AniList search with auto-suggestions; add any manhwa/manga directly to your shelf
- **Custom rating systems** — switch between F-S tiers, stars, hearts, or flames; applies across your whole shelf
- **Reviews** — one review per webtoon, with written thoughts and a reading status (reading / completed / dropped)
- **Chapter tracking** — log your current chapter on each review
- **Chapter notes** — keep a running journal of thoughts at specific chapters
- **Filter & sort your shelf** — by status, genre, rating, or search by title; sort by tier, chapter progress, title, or date added
- **Stats page** — radar chart of genre interests, tier distribution, and reading status breakdown
- **Recommendations** — suggested titles based on your highest-rated genres and what you're currently reading
- **Wishlist** — webtoons you've added but haven't started reviewing yet

## Stack

**Frontend**
- React + Vite
- React Router - client-side routing
- Axios - HTTP requests
- Chart.js - genre radar chart on the stats page

**Backend**
- FastAPI - REST API
- SQLAlchemy - ORM
- PostgreSQL - database
- Uvicorn - ASGI server

**External API**
- AniList GraphQL API - webtoon/manga search, cover art, genres, descriptions, scores

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
│   │   │   ├── WebtoonCard.jsx        # shelf grid card with tier badge and delete
│   │   │   ├── WebtoonForm.jsx        # manual add webtoon form
│   │   │   ├── WebtoonSearch.jsx      # AniList live search with debounced suggestions
│   │   │   ├── ReviewForm.jsx         # rating, status, chapter, and review form
│   │   │   ├── ChapterNotes.jsx       # per-chapter notes timeline
│   │   │   ├── Recommendations.jsx    # genre-based AniList recommendations
│   │   │   ├── TierBadge.jsx          # renders the active rating system's badge
│   │   │   └── RatingSystemPicker.jsx # switch between tiers/stars/hearts/flames
│   │   ├── pages/
│   │   │   ├── Home.jsx               # shelf browsing, search, filters, sort
│   │   │   ├── WebtoonDetail.jsx      # reviews, editing, chapter notes
│   │   │   ├── Stats.jsx              # genre radar chart and rating breakdown
│   │   │   └── Wishlist.jsx           # webtoons with no review yet
│   │   ├── utils/
│   │   │   └── tiers.js               # rating system definitions and localStorage logic
│   │   ├── api.js                     # axios instance
│   │   └── App.jsx                    # routing
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app, CORS, router registration
│   │   ├── database.py                # PostgreSQL connection and session management
│   │   ├── models.py                  # Webtoon, Review, ChapterNote tables
│   │   ├── schemas.py                 # request/response shape validation
│   │   └── routers/
│   │       ├── webtoons.py            # CRUD routes for webtoons
│   │       ├── reviews.py             # CRUD routes for reviews
│   │       └── chapter_notes.py       # CRUD routes for chapter notes
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
| GET | `/reviews/?webtoon_id={id}` | Get the review for a webtoon |
| POST | `/reviews/` | Add a review (one per webtoon) |
| PUT | `/reviews/{id}` | Update a review |
| DELETE | `/reviews/{id}` | Delete a review |
| GET | `/chapter-notes/?webtoon_id={id}` | Get all chapter notes for a webtoon |
| POST | `/chapter-notes/` | Add a chapter note |
| DELETE | `/chapter-notes/{id}` | Delete a chapter note |

## Rating systems

Ratings are stored as integers 1-6 in the database, decoupled from how they're displayed. The active display style is saved in localStorage and applies across the whole app:

| System | Display |
|---|---|
| Tiers | F - D - C - B - A - S |
| Stars | one star through five-plus stars |
| Hearts | one heart through six hearts |
| Flames | one flame through six flames |

## Notes

- No authentication yet - all data lives in a single shared database. Fine for solo/local use; would need auth before sharing with others or deploying publicly.
- AniList search and recommendations run client-side and call AniList's public GraphQL API directly - no API key required.