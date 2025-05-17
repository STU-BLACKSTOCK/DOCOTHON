import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Users, ChevronDown, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import axios from "axios";

interface Patient {
  id: number;
  name: string;
  abha_id: string;
  dob: string;
  gender: string;
  blood_group?: string;
  status: "Active" | "Inactive";
}

const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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
        setPatients(response.data);
      } catch (error) {
        toast.error("Failed to fetch patients");
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);
  
  // Filter patients based on search term and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.abha_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading patients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" /> Patients
          </h1>
          <p className="text-muted-foreground">
            View and manage patient information
          </p>
        </div>

        {user?.role === "doctor" && (
          <Button 
            size="sm"
            onClick={() => navigate("/patients/new")}
          >
            Add New Patient
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or ABHA ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter || "All Statuses"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 py-3 px-4 text-sm font-medium text-muted-foreground bg-muted/50">
              <div className="col-span-5">Patient</div>
              <div className="col-span-2 text-center hidden sm:block">ABHA ID</div>
              <div className="col-span-2 text-center hidden sm:block">Gender</div>
              <div className="col-span-2 text-center sm:text-left">Status</div>
              <div className="col-span-1"></div>
            </div>

            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="grid grid-cols-12 py-3 px-4 items-center border-t hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-primary-100 text-primary-800">
                      <span>{patient.name.charAt(0)}</span>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {patient.id}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    {patient.abha_id}
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    {patient.gender}
                  </div>
                  <div className="col-span-2 text-center sm:text-left">
                    <Badge variant={patient.status === "Active" ? "default" : "outline"}>
                      {patient.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/patient/${patient.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No patients found matching your search criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
