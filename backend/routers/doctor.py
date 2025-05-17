from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import date, datetime, timedelta

from database import get_db
from models.user import User, Doctor
from models.patient import Patient
from models.appointment import Appointment
from models.medical_record import MedicalRecord
from schemas.patient import Patient as PatientSchema, PatientDetail
from schemas.appointment import AppointmentDetail
from core.auth import get_current_user

router = APIRouter(prefix="/doctor", tags=["doctor"])

@router.get("/dashboard")
async def get_doctor_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a doctor"
        )

    doctor = current_user.doctor_profile

    # Get total patients count (unique patients who have appointments with this doctor)
    total_patients = db.query(func.count(func.distinct(Appointment.patient_id)))\
        .filter(Appointment.doctor_id == doctor.id).scalar()

    # Get upcoming appointments
    today = date.today()
    upcoming_appointments = db.query(Appointment)\
        .filter(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date >= today,
            Appointment.status == 'scheduled'
        )\
        .order_by(Appointment.appointment_date, Appointment.appointment_time)\
        .limit(5)\
        .all()

    # Get recent medical records
    recent_records = db.query(MedicalRecord)\
        .filter(MedicalRecord.doctor_id == doctor.id)\
        .order_by(MedicalRecord.created_at.desc())\
        .limit(5)\
        .all()

    return {
        "doctor_name": current_user.name,
        "specialization": doctor.specialization,
        "total_patients": total_patients,
        "upcoming_appointments_count": len(upcoming_appointments),
        "upcoming_appointments": upcoming_appointments,
        "recent_records": recent_records
    }

@router.get("/patients", response_model=List[PatientDetail])
async def get_doctor_patients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a doctor"
        )

    doctor = current_user.doctor_profile

    # Get all patients who have had appointments with this doctor
    patients = db.query(Patient)\
        .join(Appointment)\
        .filter(Appointment.doctor_id == doctor.id)\
        .distinct()\
        .all()

    # Enhance patient data with additional information
    patient_details = []
    for patient in patients:
        # Calculate total visits
        total_visits = db.query(func.count(MedicalRecord.id))\
            .filter(
                MedicalRecord.patient_id == patient.id,
                MedicalRecord.doctor_id == doctor.id
            ).scalar()

        # Get last visit date
        last_visit = db.query(MedicalRecord.visit_date)\
            .filter(
                MedicalRecord.patient_id == patient.id,
                MedicalRecord.doctor_id == doctor.id
            )\
            .order_by(MedicalRecord.visit_date.desc())\
            .first()

        # Get next appointment
        next_appointment = db.query(Appointment)\
            .filter(
                Appointment.patient_id == patient.id,
                Appointment.doctor_id == doctor.id,
                Appointment.appointment_date >= date.today(),
                Appointment.status == 'scheduled'
            )\
            .order_by(Appointment.appointment_date)\
            .first()

        # Calculate age
        age = None
        if patient.date_of_birth:
            today = date.today()
            age = today.year - patient.date_of_birth.year - \
                ((today.month, today.day) < (patient.date_of_birth.month, patient.date_of_birth.day))

        patient_dict = PatientDetail(
            **patient.__dict__,
            age=age,
            total_visits=total_visits,
            last_visit=last_visit[0] if last_visit else None,
            upcoming_appointment=next_appointment.appointment_date if next_appointment else None
        )
        patient_details.append(patient_dict)

    return patient_details

@router.get("/appointments", response_model=List[AppointmentDetail])
async def get_doctor_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a doctor"
        )

    doctor = current_user.doctor_profile

    # Get upcoming appointments
    appointments = db.query(Appointment)\
        .filter(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date >= date.today()
        )\
        .order_by(Appointment.appointment_date, Appointment.appointment_time)\
        .all()

    return appointments 