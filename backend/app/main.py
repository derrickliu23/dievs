# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routers import webtoons, reviews

# create all tables in the database if they don't exist yet
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware allows the React frontend (running on localhost:5173)
# to make requests to the FastAPI backend (running on localhost:8000)
# without this the browser blocks cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# register the routers — each one handles a group of related routes
app.include_router(webtoons.router)
app.include_router(reviews.router)

@app.get("/health")
def health():
    return {"status": "ok"}