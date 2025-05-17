from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, patient, document, doctor
import uvicorn
from database import Base, engine, mongo_client, mongodb
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Import all models to ensure they are registered with SQLAlchemy
from models.user import User, Doctor, Staff
from models.patient import Patient
from models.document import Document
from models.appointment import Appointment
from models.medical_record import MedicalRecord

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthData API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test database connections
@app.on_event("startup")
async def startup_db_client():
    try:
        # Test PostgreSQL connection using psycopg2
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "dockothon"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "Vish@123#"),  # Use raw password here
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
        # Test the connection
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.close()
        conn.close()
        print("\033[92m✓ Successfully connected to PostgreSQL!\033[0m")
    except Exception as e:
        print(f"\033[91m✗ PostgreSQL connection failed: {str(e)}\033[0m")
        
    try:
        # Test MongoDB connection
        mongo_client.admin.command('ping')
        print("\033[92m✓ Successfully connected to MongoDB!\033[0m")
    except Exception as e:
        print(f"\033[91m✗ MongoDB connection failed: {str(e)}\033[0m")

# Routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(patient.router, prefix="/patients", tags=["Patients"])
app.include_router(document.router, prefix="/documents", tags=["Documents"])
app.include_router(doctor.router, prefix="/api", tags=["Doctor"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"message": "HealthData API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)