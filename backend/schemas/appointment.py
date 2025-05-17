from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime
from .patient import Patient

class AppointmentBase(BaseModel):
    appointment_date: date
    appointment_time: time
    reason: Optional[str] = None
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    patient_id: int
    doctor_id: int

class Appointment(AppointmentBase):
    id: int
    patient_id: int
    doctor_id: int
    status: str
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AppointmentDetail(Appointment):
    patient: Patient

    class Config:
        from_attributes = True 