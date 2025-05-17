# Dockothon - Healthcare Management System

A modern healthcare management system built with FastAPI (Backend) and React (Frontend).

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- PostgreSQL 12 or higher
- MongoDB 4.4 or higher

## Project Structure

```
project/
├── backend/         # FastAPI backend
└── src/            # React frontend
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```env
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=dockothon

MONGO_URI=mongodb://localhost:27017
MONGO_DB=dockothon

SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Initialize the database:
```bash
python setup_db.py
```

6. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the project root directory and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Demo Credentials

### Doctor Login
```
Aadhaar ID: 123456789012
Password: password123
Role: Doctor
Name: Dr. John Doe
Specialization: Cardiologist
```

### Staff Login
```
Aadhaar ID: 456789012345
Password: password123
Role: Staff
Name: Staff Alice Brown
Department: Reception
```

## Sample Patient Data

1. Rahul Kumar
   - Aadhaar ID: 111122223333
   - ABHA ID: ABHA111122223333
   - Contact: 9876543210

2. Priya Singh
   - Aadhaar ID: 444455556666
   - ABHA ID: ABHA444455556666
   - Contact: 9876543220

3. Amit Patel
   - Aadhaar ID: 777788889999
   - ABHA ID: ABHA777788889999
   - Contact: 9876543230

## API Documentation

Once the backend is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

### Doctor Dashboard
- View total patient count
- Upcoming appointments
- Recent medical records
- Patient management
- Appointment scheduling

### Staff Dashboard
- Patient registration
- Appointment management
- Document management

## Database Schema

### PostgreSQL Tables
- users (Authentication & User Management)
- doctors (Doctor Profiles)
- staff (Staff Profiles)
- patients (Patient Information)
- appointments (Appointment Management)
- medical_records (Patient Medical History)

### MongoDB Collections
- documents (Medical Documents & Reports)

## API Endpoints

### Authentication
- POST `/auth/login` - User login
- POST `/auth/register` - User registration

### Doctor
- GET `/api/doctor/dashboard` - Dashboard data
- GET `/api/doctor/patients` - List of patients
- GET `/api/doctor/appointments` - List of appointments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
