
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  ArrowLeft,
  Download,
  PenSquare,
  Info,
  User,
  Activity,
} from "lucide-react";
import { mockDocuments, mockPatients } from "@/lib/mockData";
import DocumentCard from "@/components/DocumentCard";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch patient data
    const timer = setTimeout(() => {
      const foundPatient = mockPatients.find(p => p.id === id);
      const patientDocuments = mockDocuments.filter(doc => doc.patientId === id);
      
      setPatient(foundPatient || null);
      setDocuments(patientDocuments || []);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Patient Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The patient you're looking for doesn't exist or you don't have access
        </p>
        <Button 
          className="mt-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const documentCount = documents.length;
  const completedCount = documents.filter(doc => doc.status === "completed").length;
  const completionPercentage = documentCount > 0 ? (completedCount / documentCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Patient Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Patient Information</CardTitle>
              <Badge variant={patient.status === "Active" ? "default" : "outline"}>
                {patient.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4 bg-primary-100 text-primary-800">
                <span className="text-2xl">{patient.name.charAt(0)}</span>
              </Avatar>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground">Patient ID: {patient.id}</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age} years</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded">
                  <Info size={16} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{patient.bloodType || "Not available"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Visit</p>
                  <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Documents Status</h3>
                <span className="text-sm">{completedCount}/{documentCount}</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedCount} of {documentCount} documents processed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>
              View and manage this patient's medical documents and AI-processed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="documents">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="summary">AI Summary</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="space-y-4 pt-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} detailed />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium mb-1">No Documents Found</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      There are no medical records uploaded for this patient yet. Upload documents to enable AI analysis.
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/staff/upload")}>
                      Upload Document
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="timeline" className="pt-4">
                <div className="relative pl-6 border-l-2 border-muted space-y-8">
                  {documents.length > 0 ? (
                    documents.map((doc, index) => (
                      <div key={doc.id} className="relative">
                        <div className="absolute -left-[25px] h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{index + 1}</span>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{doc.type}</h3>
                            <Badge variant="outline" className="text-xs">
                              {new Date(doc.uploadDate).toLocaleDateString()}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">
                            {doc.description || "Document uploaded for AI processing."}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <FileText size={14} className="mr-1" /> View Document
                            </Button>
                            {doc.status === "completed" && (
                              <Button size="sm" variant="ghost">
                                <PenSquare size={14} className="mr-1" /> View Analysis
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No timeline data available
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="pt-4">
                {documents.some(doc => doc.status === "completed") ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Key Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm">Current Medications</h4>
                          <ul className="list-disc pl-5 mt-1 text-sm">
                            <li>Atorvastatin 40mg daily</li>
                            <li>Metformin 500mg twice daily</li>
                            <li>Amlodipine 5mg daily</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Allergies</h4>
                          <ul className="list-disc pl-5 mt-1 text-sm">
                            <li>Penicillin</li>
                            <li>Shellfish</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Recent Lab Results</h4>
                          <ul className="list-disc pl-5 mt-1 text-sm">
                            <li>Blood glucose: 112 mg/dL (Slightly elevated)</li>
                            <li>HbA1c: 6.2% (Pre-diabetic range)</li>
                            <li>Total Cholesterol: 195 mg/dL</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div>
                      <h3 className="font-medium mb-3">Clinical Summary</h3>
                      <p className="text-sm">
                        {patient.name} is a {patient.age}-year-old {patient.gender.toLowerCase()} with a history of Type 2 Diabetes and Hypertension. Recent lab results show slightly elevated blood glucose levels with HbA1c in the pre-diabetic range. The patient has been maintaining medication adherence with Metformin, Atorvastatin, and Amlodipine.
                      </p>
                      <p className="text-sm mt-3">
                        Last visit revealed stable blood pressure readings at 138/82 mmHg. Patient reports mild fatigue but denies chest pain or shortness of breath. Dietary recommendations include reduced sodium intake and portion control to help manage diabetes.
                      </p>
                      
                      <div className="mt-6">
                        <Button variant="outline" onClick={() => toast.info("Report export functionality coming soon")}>
                          <Download size={16} className="mr-2" /> Export Summary Report
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium mb-1">No Summary Available</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      AI summary will be generated once documents have been processed.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="diagnosis" className="pt-4">
                {documents.some(doc => doc.status === "completed") ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">AI-Generated Diagnosis</CardTitle>
                        <CardDescription>
                          Generated from clinical notes and medical records
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm">Primary Diagnoses</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Type 2 Diabetes Mellitus</span>
                                  <Badge>90%</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  ICD-10: E11.9
                                </p>
                              </div>
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Essential Hypertension</span>
                                  <Badge>85%</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  ICD-10: I10
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm">Secondary Diagnoses</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Hyperlipidemia</span>
                                  <Badge variant="outline">65%</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  ICD-10: E78.5
                                </p>
                              </div>
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Obesity</span>
                                  <Badge variant="outline">60%</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  ICD-10: E66.9
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Treatment Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-sm">Continue current medication regimen with monitoring of blood glucose levels</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-sm">Consider increasing Metformin to 1000mg twice daily if blood glucose remains elevated</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-sm">Lifestyle modifications including 30 minutes of daily exercise and diabetic diet</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-sm">Follow-up in 3 months with comprehensive metabolic panel</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium mb-1">No Diagnosis Available</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      AI diagnosis will be generated once documents have been processed.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientPage;
