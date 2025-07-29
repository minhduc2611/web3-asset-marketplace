/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NodeDetailContent } from "@/components/node-detail-content";
import MemoryViewer from '@/components/memory-viewer';

interface NodeDetailModalProps {
  open: boolean;
  node: any | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

function NodeDetailModal({
  open,
  node,
  onOpenChange,
  onClose
}: NodeDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 sm:max-w-4xl mx-3 sm:mx-auto max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-slate-50">Node Details: &quot;{node?.name}&quot;</DialogTitle>
              <DialogDescription className="text-slate-400">
                Complete information about this node
              </DialogDescription>
            </div>
            <MemoryViewer />
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <NodeDetailContent 
            node={node} 
            theme="dark"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 touch-manipulation"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(NodeDetailModal, (prevProps, nextProps) => {
  // Only re-render if open or node changes, ignore function prop changes
  return prevProps.open === nextProps.open;
});