# app/routers/webtoons.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Webtoon
from app.schemas import WebtoonCreate, WebtoonResponse
from typing import List

# APIRouter groups related routes together
# prefix means all routes here start with /webtoons
router = APIRouter(prefix="/webtoons", tags=["webtoons"])

# GET /webtoons — return all webtoons
@router.get("/", response_model=List[WebtoonResponse])
def get_webtoons(db: Session = Depends(get_db)):
    return db.query(Webtoon).all()

# GET /webtoons/{id} — return a single webtoon by id
@router.get("/{webtoon_id}", response_model=WebtoonResponse)
def get_webtoon(webtoon_id: int, db: Session = Depends(get_db)):
    webtoon = db.query(Webtoon).filter(Webtoon.id == webtoon_id).first()
    if not webtoon:
        raise HTTPException(status_code=404, detail="Webtoon not found")
    return webtoon

# POST /webtoons — create a new webtoon
@router.post("/", response_model=WebtoonResponse)
def create_webtoon(webtoon: WebtoonCreate, db: Session = Depends(get_db)):
    new_webtoon = Webtoon(**webtoon.model_dump())
    db.add(new_webtoon)
    db.commit()
    db.refresh(new_webtoon)
    return new_webtoon

# DELETE /webtoons/{id} — delete a webtoon
@router.delete("/{webtoon_id}")
def delete_webtoon(webtoon_id: int, db: Session = Depends(get_db)):
    webtoon = db.query(Webtoon).filter(Webtoon.id == webtoon_id).first()
    if not webtoon:
        raise HTTPException(status_code=404, detail="Webtoon not found")
    db.delete(webtoon)
    db.commit()
    return {"message": "Webtoon deleted"}