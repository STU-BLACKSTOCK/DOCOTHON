
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  status: "processing" | "completed";
  uploadDate: string;
  description?: string;
}

interface DocumentCardProps {
  document: Document;
  detailed?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, detailed = false }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className={detailed ? "p-4" : "p-3"}>
        <div className="flex items-center gap-3">
          <div className={`shrink-0 ${detailed ? "p-3" : "p-2"} bg-primary-50 rounded-md text-primary-600`}>
            <FileText size={detailed ? 24 : 20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{document.type}</div>
                {!detailed && (
                  <div className="text-sm text-muted-foreground truncate">
                    Patient: {document.patientName} (#{document.patientId})
                  </div>
                )}
              </div>
              <Badge
                variant={document.status === "completed" ? "default" : "outline"}
                className={`ml-2 ${document.status === "processing" ? "bg-amber-100 text-amber-800 hover:bg-amber-100/80" : ""}`}
              >
                {document.status === "completed" ? "Completed" : "Processing"}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
            </div>
            
            {detailed && document.description && (
              <p className="text-sm mt-2">{document.description}</p>
            )}

            {detailed && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm">
                  <Eye size={14} className="mr-1" /> View
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Download functionality coming soon")}>
                  <Download size={14} className="mr-1" /> Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
