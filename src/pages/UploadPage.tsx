import React, { useState, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, Check } from "lucide-react";
import { toast } from "sonner";
import { documentsApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [patientId, setPatientId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId) {
      toast.error("Please enter a patient ID");
      return;
    }
    
    if (!documentType) {
      toast.error("Please select a document type");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patient_uuid', patientId);
      formData.append('doc_type', documentType);

      // Comment out API call for now
      /*
      const response = await documentsApi.uploadDocument(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.loaded / progressEvent.total * 100;
          setUploadProgress(Math.round(progress));
        }
      });
      */

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      setIsUploading(false);
      setUploadComplete(true);
      
      // Invalidate documents query cache
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload document. Please try again.");
      setIsUploading(false);
    }
  };

  const handleFileClear = () => {
    setFileName("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Document</h1>
        <p className="text-muted-foreground">
          Upload and process patient medical documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Upload scanned prescriptions, lab reports, and other medical documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    placeholder="Enter patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="lab_report">Lab Report</SelectItem>
                      <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                      <SelectItem value="imaging_report">Imaging Report</SelectItem>
                      <SelectItem value="clinical_notes">Clinical Notes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Document</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors ${
                    fileName ? "bg-muted/30" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />

                  {!fileName ? (
                    <div className="flex flex-col items-center justify-center h-32 cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="font-medium">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PDF, JPG or PNG (max. 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-card p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="bg-primary-50 text-primary-600 p-2 rounded-md mr-3">
                          <FileText size={20} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium truncate max-w-xs">{fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedFile?.size
                              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileClear();
                        }}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Upload Progress</Label>
                    <span className="text-sm">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading || !selectedFile}>
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
            <CardDescription>
              Follow these guidelines for successful uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                  <Check size={16} />
                </div>
                <span className="text-sm">
                  Ensure documents are clearly scanned and legible
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                  <Check size={16} />
                </div>
                <span className="text-sm">
                  Remove any patient identifiable information not required for treatment
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                  <Check size={16} />
                </div>
                <span className="text-sm">
                  Verify the document type before uploading
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                  <Check size={16} />
                </div>
                <span className="text-sm">
                  Maximum file size: 10MB
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary-600 p-1 rounded-full mt-0.5">
                  <Check size={16} />
                </div>
                <span className="text-sm">
                  Supported formats: PDF, JPG, PNG
                </span>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-accent-50 rounded-md border border-accent-200">
              <p className="text-sm font-medium text-accent-800">
                Processing Information
              </p>
              <p className="text-xs text-accent-700 mt-1">
                After upload, our AI system will process the document to extract and standardize medical information. This may take a few minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {uploadComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Upload Successful</h3>
                <p className="text-sm text-muted-foreground">
                  Your document is now being processed by our AI system
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setUploadComplete(false);
                  setFileName("");
                  setSelectedFile(null);
                  setPatientId("");
                  setDocumentType("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Upload Another
              </Button>
              <Button onClick={() => navigate("/documents")}>
                View All Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadPage;