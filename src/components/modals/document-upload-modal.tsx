import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, FileText, Sparkles, Split } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TextChunker from "@/components/text-chunker";

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parsedData: {
    text: string;
    filename: string;
    fileType: "pdf" | "docx";
    wordCount: number;
  } | null;
  canvasId: string;
}

interface Chunk {
  id: string;
  text: string;
  name: string;
  description: string;
  startIndex: number;
  endIndex: number;
}

export default function DocumentUploadModal({
  open,
  onOpenChange,
  parsedData,
  canvasId,
}: DocumentUploadModalProps) {
  const [editedText, setEditedText] = useState(parsedData?.text || "");
  const [isBeautifying, setIsBeautifying] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "chunk">("edit");
  const [chunks, setChunks] = useState<Chunk[]>([]);

  // Update edited text when parsedData changes
  useEffect(() => {
    if (parsedData?.text) {
      setEditedText(parsedData.text);
    }
    setActiveTab("edit");
  }, [parsedData?.text]);

  // Handle chunks change from TextChunker
  const handleChunksChange = (newChunks: Chunk[]) => {
    setChunks(newChunks);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      toast.success("Text copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy text");
      console.error("Copy failed:", error);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([editedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      parsedData?.filename?.replace(/\.[^/.]+$/, "") || "document"
    }_parsed.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded!");
  };

  const handleBeautifyText = async () => {
    if (!editedText.trim()) {
      toast.error("No text to beautify");
      return;
    }

    setIsBeautifying(true);
    try {
      // Split text into chunks of max 1000 words
      const words = editedText.split(/\s+/);
      const chunks: string[] = [];
      const maxWordsPerChunk = 1000;

      for (let i = 0; i < words.length; i += maxWordsPerChunk) {
        const chunk = words.slice(i, i + maxWordsPerChunk).join(" ");
        chunks.push(chunk);
      }

      // If text is small enough, process as single chunk
      if (chunks.length === 1) {
        const response = await fetch("/api/beautify-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editedText }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to beautify text");
        }

        const data = await response.json();
        setEditedText(data.beautifiedText);
      } else {
        // Process multiple chunks in parallel
        toast.info(`Processing ${chunks.length} chunks in parallel...`);

        const beautifyPromises = chunks.map(async (chunk, index) => {
          const response = await fetch("/api/beautify-text", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: chunk }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Failed to beautify chunk ${index + 1}: ${
                errorData.message || "Unknown error"
              }`
            );
          }

          const data = await response.json();
          return data.beautifiedText;
        });

        // Wait for all chunks to be processed
        const beautifiedChunks = await Promise.all(beautifyPromises);

        // Combine the results
        const combinedText = beautifiedChunks.join("\n\n");
        setEditedText(combinedText);
      }

      toast.success("Text beautified successfully!");
    } catch (error) {
      console.error("Beautify error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to beautify text"
      );
    } finally {
      setIsBeautifying(false);
    }
  };

  const handleSaveChunks = async () => {
    if (!chunks.length) {
      toast.error("No chunks to save");
      return;
    }

    const chunksData = {
      canvasId: canvasId,
      filename: parsedData?.filename || "document",
      originalText: editedText,
      chunks: chunks.map((chunk) => ({
        id: chunk.id,
        name: chunk.name,
        description: chunk.description,
        text: chunk.text,
        startIndex: chunk.startIndex,
        endIndex: chunk.endIndex,
      })),
      metadata: {
        totalChunks: chunks.length,
        totalCharacters: editedText.length,
        createdAt: new Date().toISOString(),
      },
    };

    try {
      const response = await fetch("/api/save-chunks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunksData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save chunks");
      }

      const result = await response.json();
      toast.success(
        `Successfully saved ${result.chunksCount} chunks!`
      );
      // close the modal
      onOpenChange(false);
    } catch (error) {
      console.error("Save chunks error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save chunks";
      toast.error(errorMessage);
    }
  };

  const handleNext = async () => {
    setActiveTab("chunk");
  };

  if (!parsedData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-3/4! max-w-3/4! h-[90vh] max-h-[90vh] flex flex-col bg-slate-900 border-slate-700 p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-slate-50 text-lg sm:text-xl">
            <FileText className="w-5 h-5" />
            Parsed Document Text
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span>File: {parsedData.filename}</span>
              <span>Type: {parsedData.fileType.toUpperCase()}</span>
              <span>Words: {parsedData.wordCount.toLocaleString()}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-h-0 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "edit" | "chunk")}
            className="flex-1 flex flex-col min-h-0"
          >
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger
                value="edit"
                className="flex items-center gap-2 data-[state=active]:bg-slate-700"
              >
                <FileText className="w-4 h-4" />
                Edit Text
              </TabsTrigger>
              <TabsTrigger
                value="chunk"
                className="flex items-center gap-2 data-[state=active]:bg-slate-700"
              >
                <Split className="w-4 h-4" />
                Chunk Text
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="edit"
              className="flex-1 flex flex-col gap-3 sm:gap-4 min-h-0 mt-4"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleCopyText}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-700 flex-1 sm:flex-none"
                >
                  <Copy className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Copy Text</span>
                  <span className="sm:hidden">Copy</span>
                </Button>
                <Button
                  onClick={handleDownloadText}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-700 flex-1 sm:flex-none"
                >
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Download as TXT</span>
                  <span className="sm:hidden">Download</span>
                </Button>
                <Button
                  onClick={handleBeautifyText}
                  variant="outline"
                  size="sm"
                  disabled={isBeautifying || !editedText.trim()}
                  className="border-slate-600 hover:bg-slate-700 flex-1 sm:flex-none disabled:opacity-50"
                >
                  <Sparkles
                    className={`w-4 h-4 sm:mr-2 ${
                      isBeautifying ? "animate-spin" : ""
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {isBeautifying ? "Beautifying..." : "Beautify Texts"}
                  </span>
                  <span className="sm:hidden">
                    {isBeautifying ? "AI..." : "Beautify"}
                  </span>
                </Button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  placeholder="Parsed text will appear here..."
                  className="h-full min-h-[300px] sm:min-h-[400px] resize-none bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 text-sm overflow-y-auto"
                />
              </div>
            </TabsContent>

            <TabsContent value="chunk" className="flex-1 min-h-0 mt-4">
              <div className="h-full overflow-y-auto bg-slate-800 rounded-lg p-4">
                <TextChunker
                  text={editedText}
                  filename={parsedData?.filename}
                  onChunksChange={handleChunksChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-3 sm:pt-4 border-t border-slate-700 flex-shrink-0">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700 w-full sm:w-auto"
          >
            Close
          </Button>
          {activeTab === "edit" && (
            <Button
              onClick={handleNext}
              variant="default"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full sm:w-auto"
            >
              Next
            </Button>
          )}
          {activeTab === "chunk" && (
            <Button
              onClick={handleSaveChunks}
              variant="default"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full sm:w-auto"
            >
              Save Chunks
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
