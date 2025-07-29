"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeDetailContent } from "@/components/node-detail-content";
import { X, Eye } from "lucide-react";
import MemoryViewer from '@/components/memory-viewer';

interface NodeDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: {
    id: string;
    name: string;
    type: 'original' | 'generated';
    description?: string | null;
    knowledge?: string | null;
  } | null;
}

export function NodeDetailDrawer({ open, onOpenChange, node }: NodeDetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-5/12! max-w-5/12! h-full flex flex-col bg-slate-800 border-slate-600">
        <DrawerHeader className="flex-shrink-0 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <DrawerTitle className="text-lg font-semibold text-slate-50">
                Node Details: &quot;{node?.name || 'Unknown'}&quot;
              </DrawerTitle>
            </div>
            <div className="flex items-center space-x-2">
              <MemoryViewer />
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 hover:bg-slate-700">
                  <X className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>
          {node && (
            <div className="flex space-x-2 mt-3">
              <Badge variant={node.type === 'original' ? 'default' : 'secondary'}>
                {node.type === 'original' ? 'Original' : 'Generated'}
              </Badge>
              {node.description && (
                <Badge variant="outline" className="border-slate-500">
                  Has Description
                </Badge>
              )}
              {node.knowledge && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Has Knowledge
                </Badge>
              )}
            </div>
          )}
          <p className="text-slate-400 text-sm mt-2">
            Complete information about this node
          </p>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4">
            <NodeDetailContent 
              node={node} 
              theme="dark"
              className="space-y-4"
            />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
} 