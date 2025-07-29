import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface GenerateKeywordsModalProps {
  open: boolean;
  nodeName: string;
  nodeCount: number;
  isAutomatic: boolean;
  onOpenChange: (open: boolean) => void;
  onNodeCountChange: (count: number) => void;
  onAutomaticChange: (automatic: boolean) => void;
  onGenerate: () => void;
  onCancel: () => void;
}

export default function GenerateKeywordsModal({
  open,
  nodeName,
  nodeCount,
  isAutomatic,
  onOpenChange,
  onNodeCountChange,
  onAutomaticChange,
  onGenerate,
  onCancel,
}: GenerateKeywordsModalProps) {
  const handleGenerate = () => {
    onGenerate();
  };

  const maxNodes = isAutomatic ? 15 : 10;
  const isGenerateDisabled = isAutomatic ? false : (nodeCount === 0 || nodeCount > maxNodes);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 max-w-md mx-3 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Generate Keywords</DialogTitle>
          <DialogDescription className="text-slate-400">
            Generate related keywords for &quot;{nodeName}&quot;.{" "}
            {isAutomatic 
              ? "Automatic mode will generate an optimal number of nodes (max 15)."
              : "Choose how many nodes to create."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="automatic-mode" className="text-slate-300">
              Automatic mode
            </Label>
            <Switch
              id="automatic-mode"
              checked={isAutomatic}
              onCheckedChange={onAutomaticChange}
            />
          </div>
          
          {!isAutomatic && (
            <div className="grid gap-2">
              <Label htmlFor="node-count" className="text-slate-300">
                Number of nodes to generate
              </Label>
              <Input
                id="node-count"
                type="number"
                min="0"
                max="10"
                value={nodeCount}
                onChange={(e) => {
                  let value = parseInt(e.target.value) || 0;
                  if (value > 10) {
                    value = 10;
                  }
                  onNodeCountChange(value);
                }}
                className="bg-slate-700 border-slate-600 text-slate-50 text-base touch-manipulation"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row-reverse sm:justify-start gap-2">
          <Button
            type="button"
            disabled={isGenerateDisabled}
            onClick={handleGenerate}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto touch-manipulation"
          >
            Generate
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-slate-600 hover:bg-slate-700 w-full sm:w-auto touch-manipulation"
          >
            Cancel
          </Button>
          {!isAutomatic && nodeCount > 10 && (
            <div className="text-red-400 text-sm">
              Maximum 10 nodes can be generated at a time.
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
