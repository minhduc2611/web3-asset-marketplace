"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TopicInput from "@/components/topic-input";
import { RotateCcw, Target, ArrowLeft, Users, Zap, Settings, Bot } from "lucide-react";
import { Canvas } from "@/shared/schema";

interface GraphNavigationBarProps {
  canvasData: Canvas | undefined;
  nodeCount: number;
  connectionCount: number;
  hasOriginalNode: boolean;
  onCreateNode: (topic: string) => void;
  isCreatingNode: boolean;
  onOpenSettings: () => void;
  onResetView: () => void;
  onCenterGraph: () => void;
  onOpenAIPartner: () => void;
}

export default function GraphNavigationBar({
  canvasData,
  nodeCount,
  connectionCount,
  hasOriginalNode,
  onCreateNode,
  isCreatingNode,
  onOpenSettings,
  onResetView,
  onCenterGraph,
  onOpenAIPartner,
}: GraphNavigationBarProps) {

  
  return (
    <nav className="backdrop-blur-sm border-b border-slate-700 px-3 sm:px-6 py-3 sm:py-4 relative z-10">
      <div className="flex items-center justify-between">
        {/* Left section - Mobile optimized */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <Link
            href="/canvas"
            className="flex items-center space-x-1 sm:space-x-2 text-slate-400 hover:text-slate-50 transition-colors touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Back to Canvases</span>
            <span className="sm:hidden text-sm">Back</span>
          </Link>
          <div className="w-px h-4 sm:h-6 bg-slate-600 hidden sm:block"></div>
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent truncate">
              {canvasData?.name || "Loading..."}
            </h1>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs"
              >
                <Zap className="w-3 h-3 mr-1" />
                {nodeCount} nodes
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-600/20 text-green-300 border-green-600/30 text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                {connectionCount} connections
              </Badge>
            </div>
          </div>
        </div>

        {/* Right section - Mobile optimized */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile node count */}
          <div className="sm:hidden">
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-xs px-2 py-1 rounded-full text-white font-medium">
              {nodeCount}
            </span>
          </div>

          {/* Topic Input - Responsive */}
          {!hasOriginalNode && (
            <div className="hidden sm:block">
              <TopicInput
                onSubmit={onCreateNode}
                isLoading={isCreatingNode}
              />
            </div>
          )}

          {/* AI Partner */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAIPartner}
            className="bg-purple-700 hover:bg-purple-600 text-purple-300 hover:text-purple-50 border-purple-600 touch-manipulation"
            title="AI Partner"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">AI Partner</span>
          </Button>

          {/* Settings */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSettings}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300! hover:text-slate-50 border-slate-600 touch-manipulation"
            title="Canvas Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Graph Controls - Mobile friendly */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetView}
              className="bg-slate-700 text-slate-300! hover:bg-slate-600 hover:text-slate-50 border-slate-600 touch-manipulation"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCenterGraph}
              className="bg-slate-700 hover:bg-slate-600 hover:text-slate-50 border-slate-600 touch-manipulation"
              title="Center Graph"
            >
              <Target className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Topic Input - Below main nav */}
      {!hasOriginalNode && (
        <div className="sm:hidden mt-3 pt-3 border-t border-slate-700">
          <TopicInput
            onSubmit={onCreateNode}
            isLoading={isCreatingNode}
          />
        </div>
      )}
    </nav>
  );
} 