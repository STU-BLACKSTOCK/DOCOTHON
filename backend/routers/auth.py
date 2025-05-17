from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any

from core.security import verify_password, get_password_hash, create_access_token
from core.config import settings
from database import get_db
from models.user import User, Doctor, Staff, UserRole
from schemas.user import UserCreate, Token, User as UserSchema

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register", response_model=UserSchema)
def register(user_data: UserCreate, db: Session = Depends(get_db)) -> Any:
    # Check if user with Aadhaar ID exists
    if db.query(User).filter(User.aadhaar_id == user_data.aadhaar_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aadhaar ID already registered"
        )
    
    # Check if ABHA ID exists (if provided)
    if user_data.abha_id and db.query(User).filter(User.abha_id == user_data.abha_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ABHA ID already registered"
        )
    
    # Create new user
    db_user = User(
        aadhaar_id=user_data.aadhaar_id,
        abha_id=user_data.abha_id,
        name=user_data.name,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create role-specific profile
    if user_data.role == UserRole.doctor:
        if not all([user_data.specialization, user_data.license_number, 
                   user_data.qualification, user_data.experience_years]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required doctor information"
            )
        doctor = Doctor(
            user_id=db_user.id,
            specialization=user_data.specialization,
            license_number=user_data.license_number,
            qualification=user_data.qualification,
            experience_years=user_data.experience_years
        )
        db.add(doctor)
    else:  # staff
        if not all([user_data.department, user_data.designation]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required staff information"
            )
        staff = Staff(
            user_id=db_user.id,
            department=user_data.department,
            designation=user_data.designation
        )
        db.add(staff)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    # Try to authenticate user using Aadhaar ID as username
    user = db.query(User).filter(User.aadhaar_id == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Aadhaar ID or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token with role information
    access_token = create_access_token(
        data={
            "sub": user.aadhaar_id,
            "user_id": user.id,
            "role": user.role.value
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
def get_me(current_user: UserSchema = Depends(oauth2_scheme)):
    return current_user
