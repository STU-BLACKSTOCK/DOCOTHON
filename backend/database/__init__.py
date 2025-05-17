from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables
load_dotenv()

# PostgreSQL Configuration
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD", "Vish@123#"))  # URL encode the password
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "dockothon")

# Construct database URL
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create SQLAlchemy engine with connection pooling and retry settings
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,  # Add connection health check
    pool_size=5,  # Set connection pool size
    max_overflow=10,  # Allow up to 10 connections to overflow
    pool_timeout=30  # Connection timeout in seconds
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "dockothon")

mongo_client = MongoClient(MONGODB_URL)
mongodb = mongo_client[MONGO_DB]

# Collections
files_collection = mongodb.files
documents_collection = mongodb.documents

# Export all necessary components
__all__ = [
    'engine', 
    'SessionLocal', 
    'Base', 
    'mongo_client', 
    'mongodb', 
    'files_collection', 
    'documents_collection'
]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 