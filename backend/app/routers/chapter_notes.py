# app/routers/chapter_notes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ChapterNote, Webtoon
from app.schemas import ChapterNoteCreate, ChapterNoteResponse
from typing import List

router = APIRouter(prefix="/chapter-notes", tags=["chapter-notes"])

# GET /chapter-notes?webtoon_id=1 — get all notes for a webtoon, ordered by chapter
@router.get("/", response_model=List[ChapterNoteResponse])
def get_notes(webtoon_id: int, db: Session = Depends(get_db)):
    return (
        db.query(ChapterNote)
        .filter(ChapterNote.webtoon_id == webtoon_id)
        .order_by(ChapterNote.chapter.asc())
        .all()
    )

# POST /chapter-notes — add a note for a specific chapter
@router.post("/", response_model=ChapterNoteResponse)
def create_note(note: ChapterNoteCreate, db: Session = Depends(get_db)):
    webtoon = db.query(Webtoon).filter(Webtoon.id == note.webtoon_id).first()
    if not webtoon:
        raise HTTPException(status_code=404, detail="Webtoon not found")

    if not note.note.strip():
        raise HTTPException(status_code=400, detail="Note cannot be empty")

    new_note = ChapterNote(**note.model_dump())
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

# DELETE /chapter-notes/{id}
@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(ChapterNote).filter(ChapterNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}