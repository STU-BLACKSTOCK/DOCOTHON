from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.patient import PatientCreate, Patient
from services import patient as patient_service
from database import get_db
from utils.jwt import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Patient])
def get_all_patients(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return patient_service.get_all_patients(db)

@router.post("/", response_model=Patient)
def create_or_fetch_patient(patient: PatientCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return patient_service.create_or_get_patient(db, patient)

@router.get("/{abha_id}", response_model=Patient)
def get_patient(abha_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    patient = patient_service.get_patient_by_abha(db, abha_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
