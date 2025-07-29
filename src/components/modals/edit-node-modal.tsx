import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EditNodeModalProps {
  open: boolean;
  name: string;
  description: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditNodeModal({
  open,
  name,
  description,
  isLoading,
  onOpenChange,
  onNameChange,
  onDescriptionChange,
  onSave,
  onCancel
}: EditNodeModalProps) {
  const handleSave = () => {
    if (name.trim()) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Edit Node</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update the node&apos;s title and description to better organize your mind map.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="node-name" className="text-slate-300">
              Title
            </Label>
            <Input
              id="node-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter node title"
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
            <Label htmlFor="node-description" className="text-slate-300">
              Description (optional)
            </Label>
            <Textarea
              id="node-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Add notes or context for this topic"
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 min-h-[80px] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-slate-600 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 