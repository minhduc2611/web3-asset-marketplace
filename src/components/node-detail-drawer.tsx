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
import { X, Eye, FileText, Search, Brain } from "lucide-react";
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
  // Parse knowledge data to get search status
  let searchStatus = 'idle';
  let hasSearchResults = false;
  
  try {
    if (node?.knowledge) {
      const knowledgeData = JSON.parse(node.knowledge);
      searchStatus = knowledgeData.googleSearchStatus || 'idle';
      hasSearchResults = knowledgeData.latestGoogleSearch?.searchResults?.length > 0;
    }
  } catch (error) {
    console.error('Error parsing knowledge data:', error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': 
        return <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />;
      case 'completed': 
        return <div className="w-3 h-3 bg-green-500 rounded-full" />;
      case 'failed': 
        return <div className="w-3 h-3 bg-red-500 rounded-full" />;
      default: 
        return <div className="w-3 h-3 bg-slate-500 rounded-full" />;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-6/12! max-w-6/12! h-full flex flex-col bg-slate-800 border-slate-600">
        <DrawerHeader className="flex-shrink-0 border-b border-slate-600 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <DrawerTitle className="text-lg font-semibold text-slate-50 flex items-center">
                  &quot;{node?.name || 'Unknown'}&quot;
                  {searchStatus === 'processing' && (
                    <div className="ml-2 flex items-center space-x-1">
                      {getStatusIcon(searchStatus)}
                      <span className="text-xs text-blue-400">Processing...</span>
                    </div>
                  )}
                </DrawerTitle>
                <p className="text-slate-400 text-sm">
                  {node?.type === 'original' ? 'Original Topic' : 'Generated Topic'}
                  {hasSearchResults && ' • Enhanced with Knowledge'}
                </p>
              </div>
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

          {/* Status and Content Badges */}
          {node && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge 
                variant={node.type === 'original' ? 'default' : 'secondary'}
                className="flex items-center space-x-1"
              >
                <FileText className="w-3 h-3" />
                <span>{node.type === 'original' ? 'Original' : 'Generated'}</span>
              </Badge>
              
              {node.description && (
                <Badge variant="outline" className="border-slate-500 flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>Has Description</span>
                </Badge>
              )}
              
              {searchStatus !== 'idle' && (
                <Badge 
                  variant="outline" 
                  className={`border-slate-500 flex items-center space-x-1 ${getStatusColor(searchStatus)}`}
                >
                  {searchStatus === 'processing' ? (
                    <Search className="w-3 h-3" />
                  ) : (
                    <Brain className="w-3 h-3" />
                  )}
                  <span className="capitalize">
                    {searchStatus === 'processing' ? 'Searching...' : 
                     searchStatus === 'completed' ? 'Knowledge Ready' : 
                     searchStatus === 'failed' ? 'Search Failed' : 'No Search'}
                  </span>
                </Badge>
              )}
              
              {hasSearchResults && (
                <Badge variant="outline" className="text-purple-400 border-purple-400 flex items-center space-x-1">
                  <Brain className="w-3 h-3" />
                  <span>AI Enhanced</span>
                </Badge>
              )}
            </div>
          )}
        </DrawerHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6">
            <NodeDetailContent 
              node={node} 
              theme="dark"
              className="space-y-6"
            />
          </div>
        </ScrollArea>

        {/* Footer with actions hint */}
        <div className="flex-shrink-0 border-t border-slate-600 bg-slate-800/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <span>💡 Tip: Right-click the node for more actions</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">ESC</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 