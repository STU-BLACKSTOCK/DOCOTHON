import uuid
from sqlalchemy.orm import Session
from models.patient import Patient
from schemas.patient import PatientCreate

def get_all_patients(db: Session):
    return db.query(Patient).all()

def generate_patient_uuid(abha_id: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, abha_id))

def get_patient_by_abha(db: Session, abha_id: str):
    return db.query(Patient).filter(Patient.abha_id == abha_id).first()

def create_or_get_patient(db: Session, patient_data: PatientCreate):
    existing = get_patient_by_abha(db, patient_data.abha_id)
    if existing:
        return existing

    patient_uuid = generate_patient_uuid(patient_data.abha_id)
    patient = Patient(
        abha_id=patient_data.abha_id,
        name=patient_data.name,
        dob=patient_data.dob,
        uuid=patient_uuid
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient
