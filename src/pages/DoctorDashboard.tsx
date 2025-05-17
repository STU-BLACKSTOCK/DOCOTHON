import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowRight, 
  Calendar, 
  FileText, 
  Search, 
  Users,
  Upload 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PatientCard from "@/components/PatientCard";
import axios from "axios";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  abha_id: string;
  dob: string;
  gender: string;
  blood_group?: string;
  status: "Active" | "Inactive";
  age: number;
  lastVisit: string;
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/patients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        // Transform the API response to include age and lastVisit
        const transformedPatients = response.data.map((patient: any) => ({
          ...patient,
          id: patient.id.toString(), // Convert id to string
          age: calculateAge(patient.dob), // Calculate age from DOB
          lastVisit: patient.last_visit || new Date().toISOString() // Use last_visit from API or current date
        }));
        
        setPatients(transformedPatients);
      } catch (error) {
        toast.error("Failed to fetch patients");
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to calculate age from DOB
    const calculateAge = (dob: string) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    };

    fetchPatients();
  }, []);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.abha_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your patients and recent activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="hidden md:flex"
            onClick={() => navigate("/patients")}
          >
            <Users size={16} className="mr-2" />
            View All Patients
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/doctor/upload")}
          >
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
          <Button size="sm" onClick={() => navigate("/reports")}>
            <FileText size={16} className="mr-2" />
            Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active patients in your care
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Needs your attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Your Patients</CardTitle>
          <CardDescription>
            View and manage your assigned patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or ABHA ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading patients...
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => navigate(`/patient/${patient.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No patients found matching your search
              </div>
            )}
          </div>
          )}

          {filteredPatients.length > 0 && filteredPatients.length < patients.length && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Your schedule for the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No upcoming appointments
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
