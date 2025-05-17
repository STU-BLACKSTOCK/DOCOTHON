
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Search,
  Upload,
  Clock,
  CheckCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDocuments } from "@/lib/mockData";
import DocumentCard from "@/components/DocumentCard";

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [documents] = useState(mockDocuments);
  const [activeTab, setActiveTab] = useState("all");

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "processing") return matchesSearch && doc.status === "processing";
    if (activeTab === "completed") return matchesSearch && doc.status === "completed";
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Manage documents and patient records
          </p>
        </div>
        <Button onClick={() => navigate("/staff/upload")}>
          <Upload size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +8 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(doc => doc.status === "processing").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Documents being analyzed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(doc => doc.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for review
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>
            View and manage uploaded patient documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No documents found matching your search
              </div>
            )}
          </div>

          {filteredDocuments.length > 0 && filteredDocuments.length < documents.length && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className={`p-2 rounded-full ${i % 2 === 0 ? 'bg-primary-50 text-primary-600' : 'bg-secondary-50 text-secondary-600'}`}>
                    {i % 2 === 0 ? <Upload size={16} /> : <CheckCircle size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {i % 2 === 0 ? 'Document uploaded' : 'Processing completed'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Patient #{Math.floor(Math.random() * 10000)} | {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processing Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents
                .filter(doc => doc.status === "processing")
                .slice(0, 3)
                .map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="p-2 rounded-full bg-accent-50 text-accent-600">
                      <Clock size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">
                          {doc.type} - Patient #{doc.patientId}
                        </p>
                        <p className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Processing
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

              {documents.filter(doc => doc.status === "processing").length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No documents currently processing
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
