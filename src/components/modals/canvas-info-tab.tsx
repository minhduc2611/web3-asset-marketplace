import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface CanvasInfoTabProps {
  initialCanvasName: string;
  initialSystemInstruction: string;
  onCanvasNameChange: (name: string) => void;
  onSystemInstructionChange: (instruction: string) => void;
  onSave: () => void;
}

export default function CanvasInfoTab({
  initialCanvasName,
  initialSystemInstruction,
  onCanvasNameChange,
  onSystemInstructionChange,
  onSave,
}: CanvasInfoTabProps) {
  const [canvasName, setCanvasName] = useState(initialCanvasName);
  const [systemInstruction, setSystemInstruction] = useState(initialSystemInstruction);

  // Update parent when values change
  useEffect(() => {
    onCanvasNameChange(canvasName);
  }, [canvasName, onCanvasNameChange]);

  useEffect(() => {
    onSystemInstructionChange(systemInstruction);
  }, [systemInstruction, onSystemInstructionChange]);

  // Reset when initial values change
  useEffect(() => {
    setCanvasName(initialCanvasName);
  }, [initialCanvasName]);

  useEffect(() => {
    setSystemInstruction(initialSystemInstruction);
  }, [initialSystemInstruction]);

  const handleCanvasNameChange = (name: string) => {
    setCanvasName(name);
  };

  const handleSystemInstructionChange = (instruction: string) => {
    setSystemInstruction(instruction);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-50 mb-4 sm:mb-6">
          Canvas Information
        </h3>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-3">
            <Label
              htmlFor="canvas-name"
              className="text-sm font-medium text-slate-300"
            >
              Canvas Name
            </Label>
            <Input
              id="canvas-name"
              value={canvasName}
              onChange={(e) => handleCanvasNameChange(e.target.value)}
              placeholder="Enter canvas name"
              className="bg-slate-700/50 border-slate-600/50 text-slate-50 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors text-base sm:text-sm min-h-[44px] sm:min-h-[auto]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSave();
                }
              }}
            />
            <div className="text-xs text-slate-400 leading-relaxed">
              Give your canvas a descriptive name to help organize your
              knowledge maps.
            </div>
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="system-instruction"
              className="text-sm font-medium text-slate-300"
            >
              System Instruction{" "}
              <span className="text-slate-500 font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="system-instruction"
              value={systemInstruction}
              onChange={(e) => handleSystemInstructionChange(e.target.value)}
              placeholder="Enter system instruction to guide AI keyword generation and search. For example: 'Focus on practical applications in business settings' or 'Emphasize beginner-friendly concepts'"
              className="bg-slate-700/50 border-slate-600/50 text-slate-50 placeholder-slate-400 min-h-[120px] sm:min-h-[200px] resize-y focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors text-base sm:text-sm"
            />
            <div className="text-xs text-slate-400 leading-relaxed">
              This instruction will be used by AI when generating
              keywords and performing searches to better align with your
              learning goals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 