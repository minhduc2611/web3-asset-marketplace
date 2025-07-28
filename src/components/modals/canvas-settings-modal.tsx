import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CanvasSettingsModalProps {
  open: boolean;
  canvasName: string;
  systemInstruction: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onCanvasNameChange: (name: string) => void;
  onSystemInstructionChange: (instruction: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function CanvasSettingsModal({
  open,
  canvasName,
  systemInstruction,
  isLoading,
  onOpenChange,
  onCanvasNameChange,
  onSystemInstructionChange,
  onSave,
  onCancel
}: CanvasSettingsModalProps) {
  const handleSave = () => {
    if (canvasName.trim()) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Canvas Settings</DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure your canvas name and system instruction that will guide AI generations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="canvas-name" className="text-slate-300">
              Canvas Name
            </Label>
            <Input
              id="canvas-name"
              value={canvasName}
              onChange={(e) => onCanvasNameChange(e.target.value)}
              placeholder="Enter canvas name"
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="system-instruction" className="text-slate-300">
              System Instruction (optional)
            </Label>
            <Textarea
              id="system-instruction"
              value={systemInstruction}
              onChange={(e) => onSystemInstructionChange(e.target.value)}
              placeholder="Enter system instruction to guide AI keyword generation and search. For example: 'Focus on practical applications in business settings' or 'Emphasize beginner-friendly concepts'"
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 min-h-[120px] resize-y"
            />
            <div className="text-xs text-slate-500">
              This instruction will be used by AI when generating keywords and performing searches to better align with your learning goals.
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canvasName.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 