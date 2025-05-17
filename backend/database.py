from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL Configuration
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/healthdata"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB Configuration
MONGODB_URL = "mongodb://localhost:27017"
mongo_client = MongoClient(MONGODB_URL)
mongodb = mongo_client['healthdata']

# Collections
files_collection = mongodb.files
documents_collection = mongodb.documents

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB Dependency
def get_mongodb():
    try:
        yield mongodb
    finally:
        pass
