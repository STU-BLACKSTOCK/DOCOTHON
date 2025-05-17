
export const mockPatients = [
  {
    id: "P1001",
    name: "John Smith",
    age: 65,
    gender: "Male",
    status: "Active",
    bloodType: "O+",
    lastVisit: "2025-04-10T10:30:00Z",
  },
  {
    id: "P1002",
    name: "Sarah Johnson",
    age: 42,
    gender: "Female",
    status: "Active",
    bloodType: "A-",
    lastVisit: "2025-04-05T14:15:00Z",
  },
  {
    id: "P1003",
    name: "Michael Brown",
    age: 58,
    gender: "Male",
    status: "Inactive",
    bloodType: "AB+",
    lastVisit: "2025-03-22T09:00:00Z",
  },
  {
    id: "P1004",
    name: "Emily Davis",
    age: 34,
    gender: "Female",
    status: "Active",
    bloodType: "B+",
    lastVisit: "2025-04-08T11:45:00Z",
  },
  {
    id: "P1005",
    name: "Robert Wilson",
    age: 72,
    gender: "Male",
    status: "Active",
    bloodType: "O-",
    lastVisit: "2025-04-01T16:30:00Z",
  },
  {
    id: "P1006",
    name: "Jennifer Taylor",
    age: 29,
    gender: "Female",
    status: "Active",
    bloodType: "A+",
    lastVisit: "2025-04-09T15:00:00Z",
  }
];

export const mockDocuments = [
  {
    id: "D1001",
    patientId: "P1001",
    patientName: "John Smith",
    type: "Prescription",
    status: "completed" as "completed",
    uploadDate: "2025-04-10T10:30:00Z",
    description: "Hypertension medication prescription including Amlodipine 5mg and Atorvastatin 40mg."
  },
  {
    id: "D1002",
    patientId: "P1001",
    patientName: "John Smith",
    type: "Lab Report",
    status: "completed" as "completed",
    uploadDate: "2025-04-10T10:35:00Z",
    description: "Blood work results showing elevated glucose levels and normal kidney function."
  },
  {
    id: "D1003",
    patientId: "P1002",
    patientName: "Sarah Johnson",
    type: "Imaging Report",
    status: "processing" as "processing",
    uploadDate: "2025-04-05T14:20:00Z"
  },
  {
    id: "D1004",
    patientId: "P1004",
    patientName: "Emily Davis",
    type: "Clinical Notes",
    status: "completed" as "completed",
    uploadDate: "2025-04-08T11:50:00Z",
    description: "Follow-up visit notes for respiratory symptoms. Patient reports improvement with prescribed antibiotics."
  },
  {
    id: "D1005",
    patientId: "P1005",
    patientName: "Robert Wilson",
    type: "Discharge Summary",
    status: "completed" as "completed",
    uploadDate: "2025-04-01T16:40:00Z",
    description: "Hospital discharge summary following cardiac monitoring. Patient stable with adjusted medication regimen."
  },
  {
    id: "D1006",
    patientId: "P1002",
    patientName: "Sarah Johnson",
    type: "Prescription",
    status: "processing" as "processing",
    uploadDate: "2025-04-05T14:25:00Z"
  },
  {
    id: "D1007",
    patientId: "P1006",
    patientName: "Jennifer Taylor",
    type: "Lab Report",
    status: "processing" as "processing",
    uploadDate: "2025-04-09T15:10:00Z"
  }
];
