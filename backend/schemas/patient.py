from pydantic import BaseModel, constr
from typing import Optional
from datetime import date, datetime

class PatientBase(BaseModel):
    aadhaar_id: constr(min_length=12, max_length=12)
    abha_id: Optional[constr(min_length=17, max_length=17)] = None
    name: constr(min_length=2, max_length=100)
    date_of_birth: date
    gender: constr(pattern="^(Male|Female|Other)$")
    blood_group: Optional[constr(pattern="^(A|B|AB|O)[+-]$")] = None
    contact_number: constr(pattern="^[0-9]{10}$")
    email: Optional[str] = None
    address: str
    emergency_contact: Optional[constr(pattern="^[0-9]{10}$")] = None
    emergency_contact_name: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PatientDetail(Patient):
    age: Optional[int] = None
    total_visits: Optional[int] = None
    last_visit: Optional[datetime] = None
    upcoming_appointment: Optional[datetime] = None

    class Config:
        from_attributes = True
