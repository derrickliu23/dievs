# app/models.py

from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone
from app.database import Base

# Webtoon table — stores info about each webtoon
class Webtoon(Base):
    __tablename__ = "webtoons"

    # auto-incrementing unique ID for each webtoon
    id = Column(Integer, primary_key=True, index=True)

    # title of the webtoon — required
    title = Column(String, nullable=False)

    # author name — required
    author = Column(String, nullable=False)

    # genre e.g. "romance", "action", "fantasy"
    genre = Column(String, nullable=True)

    # optional cover image URL
    cover_url = Column(String, nullable=True)

    # optional description
    description = Column(Text, nullable=True)

    # when this webtoon was added to the platform
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# Review table — stores ratings and written reviews for webtoons
class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    # which webtoon this review is for
    # this is a foreign key — it references the id column in the webtoons table
    webtoon_id = Column(Integer, nullable=False, index=True)

    # star rating 1-5
    rating = Column(Integer, nullable=False)

    # written review — optional
    content = Column(Text, nullable=True)

    # reading status — "reading", "completed", or "dropped"
    status = Column(String, nullable=False, default="reading")

    # when this review was written
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))