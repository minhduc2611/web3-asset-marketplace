import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ParseDocumentResponse } from "@/shared/schema";

interface DocumentUploadAreaProps {
  onDocumentParsed: (data: ParseDocumentResponse) => void;
}

export default function DocumentUploadArea({ onDocumentParsed }: DocumentUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid File Type", {
        description: "Please upload a PDF or DOCX file.",
      });
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File Too Large", {
        description: "Maximum file size is 10MB.",
      });
      return false;
    }

    return true;
  };

  const processDocument = async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to parse document");
      }

      const result: ParseDocumentResponse = await response.json();
      
      toast.success("Document Parsed Successfully!", {
        description: `Extracted ${result.wordCount.toLocaleString()} words from ${result.filename}`,
      });
      
      onDocumentParsed(result);
    } catch (error) {
      console.error("Document processing error:", error);
      toast.error("Processing Failed", {
        description: error instanceof Error ? error.message : "Failed to process document",
      });
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processDocument(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      processDocument(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-all duration-200 ${
          isDragOver
            ? "border-blue-500 bg-blue-600/10"
            : "border-slate-600 bg-slate-800/50"
        } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 animate-spin" />
            ) : (
              <div className="flex gap-1 sm:gap-2">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400" />
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 self-end" />
              </div>
            )}
          </div>
          
          <div>
            <p className="text-base sm:text-lg font-medium text-slate-300 mb-2">
              {isProcessing ? "Processing Document..." : "Upload Document"}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">
              Drag & drop your file here, or click to select
            </p>
            <p className="text-xs text-slate-500">
              Supports PDF and DOCX files (max 10MB)
            </p>
          </div>

          {!isProcessing && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="text-black border-slate-600 hover:bg-slate-700 w-full sm:w-auto"
              >
                Choose File
              </Button>
              <Input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
            </div>
          )}
        </div>
      </div>

      {/* File Preview */}
      {uploadedFile && !isProcessing && (
        <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-600">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-300 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              onClick={removeFile}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-300 hover:bg-slate-700 flex-shrink-0 p-1 sm:p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 