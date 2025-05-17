from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, patient, document, doctor
import uvicorn
from database import Base, engine, mongo_client
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
        # Test PostgreSQL connection
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5432"
        )
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

# Database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

class LoginRequest(BaseModel):
    id: str
    password: str
    role: str

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Query to find user
        query = """
            SELECT 
                u.id, 
                u.aadhaar_id, 
                u.abha_id, 
                u.name, 
                u.hashed_password, 
                u.role,
                CASE 
                    WHEN u.role = 'doctor' THEN d.specialization 
                    WHEN u.role = 'staff' THEN s.department
                END as department_or_specialization
            FROM users u
            LEFT JOIN doctors d ON u.id = d.user_id
            LEFT JOIN staff s ON u.id = s.user_id
            WHERE (u.aadhaar_id = %s OR u.abha_id = %s)
            AND u.role::text = %s
            AND u.is_active = true
        """
        
        cur.execute(query, (request.id, request.id, request.role))
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # For demo purposes, check if password matches 'password123'
        # In production, you should use proper password hashing
        if request.password != 'password123':
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Generate JWT token
        token = jwt.encode(
            {
                'user_id': user['id'],
                'role': user['role'],
                'exp': datetime.utcnow() + timedelta(days=1)
            },
            os.getenv('JWT_SECRET', 'your-secret-key'),
            algorithm='HS256'
        )

        return {
            "success": True,
            "token": token,
            "user": {
                "id": str(user['id']),
                "name": user['name'],
                "role": user['role'],
                "aadhaar_id": user['aadhaar_id'],
                "abha_id": user['abha_id']
            }
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during login")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"message": "HealthData API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)