from pydantic import BaseModel, Field, constr
from typing import Optional, Literal
from datetime import datetime

class UserBase(BaseModel):
    aadhaar_id: constr(min_length=12, max_length=12)
    abha_id: Optional[constr(min_length=17, max_length=17)] = None
    name: constr(min_length=2, max_length=100)
    role: Literal["doctor", "staff"]

class UserCreate(UserBase):
    password: constr(min_length=8)
    # Additional fields based on role
    # For doctors
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    # For staff
    department: Optional[str] = None
    designation: Optional[str] = None

class UserLogin(BaseModel):
    aadhaar_id: constr(min_length=12, max_length=12)
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    aadhaar_id: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None

class DoctorProfile(BaseModel):
    specialization: str
    license_number: str
    qualification: str
    experience_years: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StaffProfile(BaseModel):
    department: str
    designation: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    doctor_profile: Optional[DoctorProfile] = None
    staff_profile: Optional[StaffProfile] = None

    class Config:
        from_attributes = True
