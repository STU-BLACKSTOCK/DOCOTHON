
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  lastVisit: string;
}

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-primary-100 text-primary-800">
            <span>{patient.name.charAt(0)}</span>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{patient.name}</h3>
              <Badge variant={patient.status === "Active" ? "default" : "outline"} className="ml-2 shrink-0">
                {patient.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-3">
              <span>ID: {patient.id}</span>
              <span>
                {patient.age} yrs, {patient.gender}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
