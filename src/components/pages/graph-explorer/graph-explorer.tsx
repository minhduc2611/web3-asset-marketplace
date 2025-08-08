"use client";
import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import GraphCanvas, { GraphCanvasRef } from "@/components/graph-canvas";
import { X, Info } from "lucide-react";
import { Canvas } from "@/shared/schema";
import { motion } from "framer-motion";
import { CanvasSettingsModal } from "@/components/modals";
import AIPartnerModal from "@/components/modals/ai-partner-modal";
import GraphNavigationBar from "./graph-navigation-bar";
import { useCanvas, useUpdateCanvas } from "@/hooks/use-canvas";
import { canvasService, GraphData } from "@/lib/canvas-service";
import { AIService } from "@/lib/ai-service";
import { NodeService } from "@/lib/node-service";
import { getCanvasGraphDataKey } from "@/keys";

export default function GraphExplorer({ canvasId }: { canvasId: string }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const graphCanvasRef = useRef<GraphCanvasRef>(null);
  
  // Settings modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // AI Partner modal state
  const [aiPartnerOpen, setAiPartnerOpen] = useState(false);
  
  // Instructions panel state
  const [instructionsExpanded, setInstructionsExpanded] = useState(true);

  // Fetch canvas info using the new hook
  const { data: canvasData } = useCanvas(canvasId);

  // Update canvas mutation using the new hook
  const updateCanvasMutation = useUpdateCanvas();

  if (!canvasId) {
    return <div>Canvas ID not found</div>;
  }

  // Fetch graph data
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: graphData, isLoading } = useQuery<GraphData>({
    queryKey: [getCanvasGraphDataKey(canvasId)],
    queryFn: () => canvasService.getGraphData(canvasId),
    enabled: !!canvasId,
    refetchOnWindowFocus: false,
  });

  // Create node mutation
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const createNodeMutation = useMutation({
    mutationFn: async (topic: string) => {
      const response = await NodeService.createNode({
        name: topic,
        canvas_id: canvasId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [getCanvasGraphDataKey(canvasId)],
      });
      toast.success("Topic Added", {
        description: `Added topic: ${data?.name || 'Unknown'}`,
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
      isAutomatic,
    }: {
      topic: string;
      nodeCount?: number;
      isAutomatic?: boolean;
    }) => {
      return AIService.generateKeywords({
        canvas_id: canvasId,
        topic_name: topic,
        node_count: nodeCount || 10,
        is_automatic: isAutomatic || false,
      });
    },
    onSuccess: (data) => {
      console.log("generateKeywordsMutation onSuccess", canvasId);
      queryClient.invalidateQueries({
        queryKey: [getCanvasGraphDataKey(canvasId)],
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
      const response = await NodeService.deleteNode(nodeId);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [getCanvasGraphDataKey(canvasId)],
      });
      setSelectedNodeId(null);
      toast.success("Node Deleted", {
        description: data.message || "Node deleted successfully",
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

  const handleGenerateKeywords = (topic: string, nodeCount?: number, isAutomatic?: boolean) => {
    generateKeywordsMutation.mutate({ topic, nodeCount, isAutomatic });
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

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleOpenAIPartner = () => {
    setAiPartnerOpen(true);
  };

  const handleSaveSettings = async (data: { canvasName: string; systemInstruction: string }) => {
    return new Promise<void>((resolve, reject) => {
      updateCanvasMutation.mutate({
        id: canvasId,
        data: {
          name: data.canvasName,
          system_instruction: data.systemInstruction
        }
      }, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error)
      });
    });
  };

  const nodeCount = graphData?.nodes.length || 0;
  const connectionCount = graphData?.edges.length || 0;

  // Check if there's an original node to hide TopicInput
  const hasOriginalNode = graphData?.nodes.some(node => node.node_type === "original") || false;

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
      <GraphNavigationBar
        canvasData={canvasData as Canvas}
        nodeCount={nodeCount}
        connectionCount={connectionCount}
        hasOriginalNode={hasOriginalNode}
        onCreateNode={handleCreateNode}
        isCreatingNode={createNodeMutation.isPending}
        onOpenSettings={handleOpenSettings}
        onResetView={handleResetView}
        onCenterGraph={handleCenterGraph}
        onOpenAIPartner={handleOpenAIPartner}
      />

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
        {instructionsExpanded ? (
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 sm:p-4 max-w-[calc(100vw-120px)] sm:max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-200">
                Instructions
              </h3>
              <button
                onClick={() => setInstructionsExpanded(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-700/50"
                aria-label="Close instructions"
              >
                <X size={14} />
              </button>
            </div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li className="hidden sm:block">• Right-click nodes for options</li>
              <li className="sm:hidden">• Long-press nodes for options</li>
              <li>• Add topics using input above</li>
              <li className="hidden sm:block">• Drag to pan, scroll to zoom</li>
              <li className="sm:hidden">• Pinch zoom, drag to pan</li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setInstructionsExpanded(true)}
            className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-2 sm:p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
            aria-label="Show instructions"
          >
            <Info size={16} />
          </button>
        )}

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
      
      {/* Canvas Settings Modal */}
      <CanvasSettingsModal
        open={settingsOpen}
        canvasId={canvasId}
        initialCanvasName={(canvasData as Canvas)?.name || ""}
        initialSystemInstruction={(canvasData as Canvas)?.system_instruction || ""}
        onOpenChange={setSettingsOpen}
        onSave={handleSaveSettings}
      />
      
      {/* AI Partner Modal */}
      <AIPartnerModal
        isOpen={aiPartnerOpen}
        onClose={() => setAiPartnerOpen(false)}
      />
    </div>
  );
}
