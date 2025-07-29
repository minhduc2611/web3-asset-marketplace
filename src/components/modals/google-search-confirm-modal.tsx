import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GoogleSearchConfirmModalProps {
  open: boolean;
  searchTerm: string;
  initialSystemInstruction: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (systemInstruction: string) => void;
  onCancel: () => void;
}

function GoogleSearchConfirmModal({
  open,
  searchTerm,
  initialSystemInstruction,
  isLoading,
  onOpenChange,
  onConfirm,
  onCancel
}: GoogleSearchConfirmModalProps) {
  const [systemInstruction, setSystemInstruction] = useState(initialSystemInstruction);

  // Reset system instruction when modal opens
  React.useEffect(() => {
    if (open) {
      setSystemInstruction(initialSystemInstruction);
    }
  }, [open, initialSystemInstruction]);

  const handleConfirm = () => {
    onConfirm(systemInstruction);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 mx-3 sm:mx-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Generate insights with System Instruction?</DialogTitle>
          <DialogDescription className="text-slate-400">
            Searching and generating insights for: &quot;{searchTerm}&quot;
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="system-instruction" className="text-slate-300 text-sm font-medium">
              System Instruction
            </Label>
            <Textarea
              id="system-instruction"
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              placeholder="Enter system instruction to guide the AI analysis..."
              className="mt-2 bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 min-h-[120px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 mt-1">
              This instruction will guide how the AI analyzes and presents the search results.
            </p>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-slate-600 hover:bg-slate-700 touch-manipulation"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white touch-manipulation"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              "Generate Insights"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GoogleSearchConfirmModal; 