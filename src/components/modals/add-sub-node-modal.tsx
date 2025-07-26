import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AddSubNodeModalProps {
  open: boolean;
  parentNodeName: string;
  name: string;
  description: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AddSubNodeModal({
  open,
  parentNodeName,
  name,
  description,
  isLoading,
  onOpenChange,
  onNameChange,
  onDescriptionChange,
  onSave,
  onCancel
}: AddSubNodeModalProps) {
  const handleSave = () => {
    if (name.trim()) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 max-w-md mx-3 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Add Sub Node</DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a new child node under &quot;{parentNodeName}&quot;. Add a title and optional metadata.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sub-node-name" className="text-slate-300">
              Node Title
            </Label>
            <Input
              id="sub-node-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter node title"
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 text-base touch-manipulation"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub-node-description" className="text-slate-300">
              Metadata (optional)
            </Label>
            <Textarea
              id="sub-node-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Add notes, context, or metadata for this sub node"
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 min-h-[80px] resize-none text-base touch-manipulation"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full sm:w-auto touch-manipulation"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto touch-manipulation"
          >
            {isLoading ? "Creating..." : "Create Sub Node"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 