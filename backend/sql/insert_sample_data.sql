-- Insert sample users (doctors and staff)
-- Note: Passwords are hashed versions of 'password123'
INSERT INTO users (aadhaar_id, abha_id, name, hashed_password, role, is_active) VALUES
    ('123456789012', 'ABHA123456789012', 'Dr. John Doe', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiGRh3gF.Ey.', 'doctor', true),
    ('987654321098', 'ABHA987654321098', 'Dr. Jane Smith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiGRh3gF.Ey.', 'doctor', true),
    ('456789012345', NULL, 'Staff Alice Brown', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiGRh3gF.Ey.', 'staff', true)
ON CONFLICT (aadhaar_id) DO NOTHING;

-- Insert doctor details
INSERT INTO doctors (user_id, specialization, license_number, qualification, experience_years)
SELECT 
    u.id,
    'Cardiologist',
    'MED123456',
    'MD, DM Cardiology',
    15
FROM users u
WHERE u.aadhaar_id = '123456789012'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialization, license_number, qualification, experience_years)
SELECT 
    u.id,
    'Neurologist',
    'MED789012',
    'MD, DM Neurology',
    12
FROM users u
WHERE u.aadhaar_id = '987654321098'
ON CONFLICT DO NOTHING;

-- Insert staff details
INSERT INTO staff (user_id, department, designation)
SELECT 
    u.id,
    'Reception',
    'Senior Receptionist'
FROM users u
WHERE u.aadhaar_id = '456789012345'
ON CONFLICT DO NOTHING;

-- Insert sample patients
INSERT INTO patients (
    aadhaar_id, abha_id, name, date_of_birth, gender, 
    blood_group, contact_number, email, address, 
    emergency_contact, emergency_contact_name
) VALUES 
    ('111122223333', 'ABHA111122223333', 'Rahul Kumar', '1985-03-15', 'Male',
    'B+', '9876543210', 'rahul.kumar@email.com', '123 Main Street, Mumbai',
    '9876543211', 'Priya Kumar'),
    ('444455556666', 'ABHA444455556666', 'Priya Singh', '1990-07-22', 'Female',
    'O+', '9876543220', 'priya.singh@email.com', '456 Park Road, Delhi',
    '9876543221', 'Amit Singh'),
    ('777788889999', 'ABHA777788889999', 'Amit Patel', '1978-11-30', 'Male',
    'A+', '9876543230', 'amit.patel@email.com', '789 Lake View, Bangalore',
    '9876543231', 'Meera Patel')
ON CONFLICT (aadhaar_id) DO NOTHING;

-- Insert appointments for Dr. John Doe (Cardiologist)
INSERT INTO appointments (
    patient_id, doctor_id, appointment_date, appointment_time,
    status, reason, notes, created_by
)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE + INTERVAL '2 days' as appointment_date,
    '10:00:00' as appointment_time,
    'scheduled' as status,
    'Regular checkup' as reason,
    'Patient reported chest pain' as notes,
    s.user_id as created_by
FROM patients p
CROSS JOIN doctors d
CROSS JOIN staff s
WHERE p.aadhaar_id = '111122223333'
AND d.license_number = 'MED123456'
AND s.department = 'Reception'
ON CONFLICT DO NOTHING;

-- Insert another appointment
INSERT INTO appointments (
    patient_id, doctor_id, appointment_date, appointment_time,
    status, reason, notes, created_by
)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE + INTERVAL '3 days' as appointment_date,
    '11:30:00' as appointment_time,
    'scheduled' as status,
    'Follow-up consultation' as reason,
    'Review ECG results' as notes,
    s.user_id as created_by
FROM patients p
CROSS JOIN doctors d
CROSS JOIN staff s
WHERE p.aadhaar_id = '444455556666'
AND d.license_number = 'MED123456'
AND s.department = 'Reception'
ON CONFLICT DO NOTHING;

-- Insert medical records
INSERT INTO medical_records (
    patient_id, doctor_id, visit_date, diagnosis,
    prescription, notes, follow_up_date
)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE - INTERVAL '10 days' as visit_date,
    'Hypertension Stage 1' as diagnosis,
    'Amlodipine 5mg once daily' as prescription,
    'Blood pressure: 140/90 mmHg' as notes,
    CURRENT_DATE + INTERVAL '20 days' as follow_up_date
FROM patients p
CROSS JOIN doctors d
WHERE p.aadhaar_id = '111122223333'
AND d.license_number = 'MED123456'
ON CONFLICT DO NOTHING;

-- Insert documents
INSERT INTO documents (
    title, description, file_type, file_size,
    storage_path, mime_type, patient_id, doctor_id, uploaded_by
)
SELECT 
    'ECG Report' as title,
    'Regular ECG checkup' as description,
    'pdf' as file_type,
    1024 as file_size,
    '/storage/documents/ecg_report.pdf' as storage_path,
    'application/pdf' as mime_type,
    p.id as patient_id,
    d.id as doctor_id,
    d.user_id as uploaded_by
FROM patients p
CROSS JOIN doctors d
WHERE p.aadhaar_id = '111122223333'
AND d.license_number = 'MED123456'
ON CONFLICT DO NOTHING;

INSERT INTO documents (
    title, description, file_type, file_size,
    storage_path, mime_type, patient_id, doctor_id, uploaded_by
)
SELECT 
    'Blood Test Results' as title,
    'Complete Blood Count' as description,
    'pdf' as file_type,
    2048 as file_size,
    '/storage/documents/blood_test.pdf' as storage_path,
    'application/pdf' as mime_type,
    p.id as patient_id,
    d.id as doctor_id,
    d.user_id as uploaded_by
FROM patients p
CROSS JOIN doctors d
WHERE p.aadhaar_id = '111122223333'
AND d.license_number = 'MED123456'
ON CONFLICT DO NOTHING; 