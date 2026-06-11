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
    # make sure the webtoon exists before creating a review for it
    webtoon = db.query(Webtoon).filter(Webtoon.id == review.webtoon_id).first()
    if not webtoon:
        raise HTTPException(status_code=404, detail="Webtoon not found")

    # validate rating is between 1 and 5
    if not 1 <= review.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

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