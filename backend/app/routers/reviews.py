# app/routers/reviews.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Review, Webtoon
from app.schemas import ReviewCreate, ReviewResponse
from typing import List

router = APIRouter(prefix="/reviews", tags=["reviews"])

# GET /reviews?webtoon_id=1 — get all reviews for a webtoon
@router.get("/", response_model=List[ReviewResponse])
def get_reviews(webtoon_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.webtoon_id == webtoon_id).all()

# POST /reviews — create a new review
@router.post("/", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    webtoon = db.query(Webtoon).filter(Webtoon.id == review.webtoon_id).first()
    if not webtoon:
        raise HTTPException(status_code=404, detail="Webtoon not found")

    # update both create and update routes
    if not 1 <= review.rating <= 6:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 6")

    # check if a review already exists for this webtoon
    existing = db.query(Review).filter(Review.webtoon_id == review.webtoon_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You've already reviewed this webtoon")

    new_review = Review(**review.model_dump())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

# DELETE /reviews/{id} — delete a review
@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}

# PUT /reviews/{id} — update a review
@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(review_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    existing = db.query(Review).filter(Review.id == review_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")

    # validate rating
    # update both create and update routes
    if not 1 <= review.rating <= 6:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 6")

    # update each field
    existing.rating  = review.rating
    existing.content = review.content
    existing.status  = review.status

    db.commit()
    db.refresh(existing)
    return existing