import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import CanvasInfoTab from "./canvas-info-tab";
import DocumentUploadArea from "./document-upload-area";
import DocumentUploadModal from "./document-upload-modal";
import type { ParseDocumentResponse } from "@/shared/schema";

interface CanvasSettingsModalProps {
  open: boolean;
  canvasId: string;
  initialCanvasName?: string;
  initialSystemInstruction?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    canvasName: string;
    systemInstruction: string;
  }) => Promise<void>;
}

export default function CanvasSettingsModal({
  canvasId,
  open,
  initialCanvasName = "",
  initialSystemInstruction = "",
  onOpenChange,
  onSave,
}: CanvasSettingsModalProps) {
  const [canvasName, setCanvasName] = useState(initialCanvasName);
  const [systemInstruction, setSystemInstruction] = useState(
    initialSystemInstruction
  );
  const [isLoading, setIsLoading] = useState(false);
  const [parsedDocument, setParsedDocument] = useState<ParseDocumentResponse | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  // Reset form when modal opens/closes or initial values change
  useEffect(() => {
    if (open) {
      setCanvasName(initialCanvasName);
      setSystemInstruction(initialSystemInstruction);
      setIsLoading(false);
    }
  }, [open, initialCanvasName, initialSystemInstruction]);

  const handleCanvasNameChange = (name: string) => {
    setCanvasName(name);
  };

  const handleSystemInstructionChange = (instruction: string) => {
    setSystemInstruction(instruction);
  };

  const handleSave = async () => {
    if (canvasName.trim()) {
      setIsLoading(true);
      try {
        await onSave({
          canvasName: canvasName.trim(),
          systemInstruction: systemInstruction.trim(),
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Error saving canvas settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 h-[90vh] max-h-[90vh] overflow-hidden w-3/4! max-w-3/4! flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-slate-50 text-lg sm:text-xl">Canvas Settings</DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Configure your canvas settings and knowledge parameters.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs
          defaultValue="canvas-info"
          className="flex flex-col sm:flex-row flex-1 overflow-hidden"
        >
          {/* Mobile: Horizontal tabs at top, Desktop: Vertical sidebar */}
          <div className="w-full sm:w-72 border-b sm:border-b-0 sm:border-r border-slate-600/50 pb-4 sm:pb-0 sm:pr-6 mb-4 sm:mb-0 flex-shrink-0">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
                Settings
              </div>
              <TabsList className="grid w-full grid-cols-2 sm:grid-rows-2 sm:grid-cols-1 gap-1 bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="canvas-info"
                  className="w-full justify-center sm:justify-start px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-slate-200 hover:bg-slate-700/50 border-0"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                    <span className="hidden sm:inline">Canvas Information</span>
                    <span className="sm:hidden">Canvas</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="knowledge"
                  className="w-full justify-center sm:justify-start px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-slate-200 hover:bg-slate-700/50 border-0"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                    <span>Knowledge</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex-1 sm:pl-8 overflow-hidden flex flex-col">
            <TabsContent value="canvas-info" className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="p-1 pr-2"> {/* Add padding for scrollbar space */}
                <CanvasInfoTab
                  initialCanvasName={initialCanvasName}
                  initialSystemInstruction={initialSystemInstruction}
                  onCanvasNameChange={handleCanvasNameChange}
                  onSystemInstructionChange={handleSystemInstructionChange}
                  onSave={handleSave}
                />
              </div>
            </TabsContent>

            <TabsContent value="knowledge" className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="p-1 pr-2"> {/* Add padding for scrollbar space */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-50 mb-4 sm:mb-6">
                      Document Import
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                      Upload PDF or DOCX documents to extract and manage their text content.
                    </p>
                    <DocumentUploadArea
                      onDocumentParsed={(data) => {
                        setParsedDocument(data);
                        setShowDocumentModal(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t border-slate-600/50 pt-4 sm:pt-6 mt-4 sm:mt-6 gap-2 sm:gap-3 flex-col sm:flex-row flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="text-black border-slate-600/50 hover:border-slate-500 transition-colors min-h-[44px] sm:min-h-[auto] w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canvasName.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-[auto] w-full sm:w-auto order-1 sm:order-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Settings"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <DocumentUploadModal
      canvasId={canvasId} 
      open={showDocumentModal}
      onOpenChange={setShowDocumentModal}
      parsedData={parsedDocument}
    />
    </>
  );
}
