# app/database.py

# sqlalchemy handles all database interaction
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# python-dotenv loads our .env file so we can read DATABASE_URL
import os
from dotenv import load_dotenv
load_dotenv()

# read the database URL from .env
# this keeps credentials out of the code
DATABASE_URL = os.getenv("DATABASE_URL")

# create the engine — this is the core connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# sessionmaker creates database sessions
# each request gets its own session — a temporary workspace for db operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class all our models inherit from
# it keeps track of every table we define
Base = declarative_base()

# dependency that FastAPI calls for each request
# hands a db session to the route, then closes it when done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()