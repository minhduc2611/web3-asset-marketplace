"use client";
import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";
import TopicInput from "@/components/topic-input";
import GraphCanvas, { GraphCanvasRef } from "@/components/graph-canvas";
import { Button } from "@/components/ui/button";
import { RotateCcw, Target, ArrowLeft, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Canvas } from "@/shared/schema";
import { motion } from "framer-motion";

interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    type: "original" | "generated";
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

export default function GraphExplorer({ canvasId }: { canvasId: string }) {
  console.log("canvasId", canvasId);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  // const [canvas, setCanvas] = useState<any>(null);
  const graphCanvasRef = useRef<GraphCanvasRef>(null);

  if (!canvasId) {
    return <div>Canvas ID not found</div>;
  }

  // Fetch canvas info
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: canvasData } = useQuery({
    queryKey: [`/api/canvas/${canvasId}`],
    enabled: !!canvasId,
    refetchOnWindowFocus: false,
  });

  // Fetch graph data
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: graphData, isLoading } = useQuery<GraphData>({
    queryKey: [`/api/canvas/graph-data/${canvasId}`],
    enabled: !!canvasId,
    refetchOnWindowFocus: false,
  });

  // Create node mutation
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const createNodeMutation = useMutation({
    mutationFn: async (topic: string) => {
      const response = await apiRequest("POST", "/api/node", {
        name: topic,
        canvasId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`/api/canvas/graph-data/${canvasId}`],
      });
      toast.success("Topic Added", {
        description: `Added topic: ${data.name}`,
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to create topic",
      });
    },
  });

  // Generate keywords mutation
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const generateKeywordsMutation = useMutation({
    mutationFn: async ({
      topic,
      nodeCount,
    }: {
      topic: string;
      nodeCount?: number;
    }) => {
      console.log("topic", topic);
      const response = await apiRequest("POST", "/api/generate-keywords", {
        name: topic,
        canvasId,
        nodeCount,
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("generateKeywordsMutation onSuccess", canvasId);
      queryClient.invalidateQueries({
        queryKey: [`/api/canvas/graph-data/${canvasId}`],
      });
      console.log("generateKeywordsMutation data", data);
      toast.success("Keywords Generated", {
        description: `Generated ${data.keywords.length} keywords using AI`,
      });
    },
    onError: (error: Error) => {
      toast.error("Generation Failed", {
        description: error.message || "Failed to generate keywords",
      });
    },
  });

  // Delete node mutation
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deleteNodeMutation = useMutation({
    mutationFn: async (nodeId: string) => {
      const response = await apiRequest("DELETE", `/api/node/${nodeId}`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`/api/canvas/graph-data/${canvasId}`],
      });
      setSelectedNodeId(null);
      toast.success("Node Deleted", {
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to delete node",
      });
    },
  });

  const handleCreateNode = (topic: string) => {
    createNodeMutation.mutate(topic);
  };

  const handleGenerateKeywords = (topic: string, nodeCount?: number) => {
    generateKeywordsMutation.mutate({ topic, nodeCount });
  };

  const handleDeleteNode = (nodeId: string) => {
    deleteNodeMutation.mutate(nodeId);
  };

  const handleCenterGraph = () => {
    graphCanvasRef.current?.centerGraph();
  };

  const handleResetView = () => {
    graphCanvasRef.current?.resetView();
  };

  const nodeCount = graphData?.nodes.length || 0;
  const connectionCount = graphData?.edges.length || 0;

  return (
    // h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 font-inter overflow-hidden
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-slate-50 font-inter overflow-hidden">
      {/* Floating Elements Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2
            }}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full blur-sm"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + i * 10}%`
            }}
          />
        ))}
      </div>
      {/* Top Navigation - Mobile Responsive */}
      <nav className=" backdrop-blur-sm border-b border-slate-700 px-3 sm:px-6 py-3 sm:py-4 relative z-10">
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
                {(canvasData as Canvas)?.name || "Loading..."}
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
            <div className="hidden sm:block">
              <TopicInput
                onSubmit={handleCreateNode}
                isLoading={createNodeMutation.isPending}
              />
            </div>

            {/* Graph Controls - Mobile friendly */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetView}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-50 border-slate-600 touch-manipulation"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCenterGraph}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-50 border-slate-600 touch-manipulation"
                title="Center Graph"
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Topic Input - Below main nav */}
        <div className="sm:hidden mt-3 pt-3 border-t border-slate-700">
          <TopicInput
            onSubmit={handleCreateNode}
            isLoading={createNodeMutation.isPending}
          />
        </div>
      </nav>

      {/* Graph Canvas */}
      <div className="relative h-[calc(100vh-100px)] sm:h-[calc(100vh-60px)]">
        <GraphCanvas
          ref={graphCanvasRef}
          graphData={graphData}
          isLoading={isLoading || generateKeywordsMutation.isPending}
          onGenerateKeywords={handleGenerateKeywords}
          onDeleteNode={handleDeleteNode}
          onNodeSelect={setSelectedNodeId}
          selectedNodeId={selectedNodeId}
          canvasId={canvasId}
          loadingMessage={
            generateKeywordsMutation.isPending
              ? "Generating keywords with AI..."
              : undefined
          }
        />

        {/* Info Panel - Mobile responsive */}
        <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 sm:p-4 max-w-[calc(100vw-120px)] sm:max-w-sm">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">
            Instructions
          </h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li className="hidden sm:block">• Right-click nodes for options</li>
            <li className="sm:hidden">• Long-press nodes for options</li>
            <li>• Add topics using input above</li>
            <li className="hidden sm:block">• Drag to pan, scroll to zoom</li>
            <li className="sm:hidden">• Pinch zoom, drag to pan</li>
          </ul>
        </div>

        {/* Statistics Panel - Mobile responsive */}
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-2 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-blue-400">
                {nodeCount}
              </div>
              <div className="text-xs text-slate-400">Nodes</div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-emerald-400">
                {connectionCount}
              </div>
              <div className="text-xs text-slate-400">Links</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
