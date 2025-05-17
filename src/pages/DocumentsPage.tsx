
import React, { useState } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, FileText, ChevronDown, Filter } from "lucide-react";
import { mockDocuments } from "@/lib/mockData";
import DocumentCard from "@/components/DocumentCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter documents based on search, type, and status
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = 
      doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = documentType === null || doc.type === documentType;
    
    const matchesStatus = 
      activeTab === "all" || 
      (activeTab === "processing" && doc.status === "processing") ||
      (activeTab === "completed" && doc.status === "completed");
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" /> Documents
          </h1>
          <p className="text-muted-foreground">
            All medical documents uploaded to the platform
          </p>
        </div>

        {user?.role === "staff" && (
          <Button onClick={() => navigate("/staff/upload")}>
            Upload New Document
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Document Management</CardTitle>
          <CardDescription>
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or document type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-3 flex-col sm:flex-row">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    {documentType || "All Types"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDocumentType(null)}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDocumentType("Prescription")}>
                    Prescription
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDocumentType("Lab Report")}>
                    Lab Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDocumentType("Imaging Report")}>
                    Imaging Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDocumentType("Clinical Notes")}>
                    Clinical Notes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDocumentType("Discharge Summary")}>
                    Discharge Summary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc}
                  detailed
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                <h3 className="font-medium">No Documents Found</h3>
                <p className="text-sm max-w-md mx-auto mt-1">
                  No documents match your current filters. Try adjusting your search or filters.
                </p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setDocumentType(null);
                    setActiveTab("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;
