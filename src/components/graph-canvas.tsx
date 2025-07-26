/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix this file
"use client"
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import cytoscape, { Core } from "cytoscape";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { toast } from "sonner"
import {
  EditNodeModal,
  AddSubNodeModal,
  GenerateKeywordsModal,
  GoogleSearchModal,
  NodeDetailModal
} from '@/components/modals';

interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    type: 'original' | 'generated';
    description?: string | null;
    knowledge?: string | null;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

interface GraphCanvasProps {
  graphData?: GraphData;
  isLoading?: boolean;
  onGenerateKeywords: (topic: string, nodeCount?: number) => void;
  onDeleteNode: (nodeId: string) => void;
  onNodeSelect: (nodeId: string | null) => void;
  selectedNodeId: string | null;
  loadingMessage?: string;
  canvasId: string;
}

export interface GraphCanvasRef {
  centerGraph: () => void;
  resetView: () => void;
}

const GraphCanvas = forwardRef<GraphCanvasRef, GraphCanvasProps>(({
  graphData,
  isLoading,
  onGenerateKeywords,
  onDeleteNode,
  onNodeSelect,
  selectedNodeId,
  loadingMessage,
  canvasId
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    nodeId: string;
    nodeName: string;
  }>({ visible: false, x: 0, y: 0, nodeId: "", nodeName: "" });
  
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    nodeId: string;
    name: string;
    description: string;
  }>({ open: false, nodeId: "", name: "", description: "" });

  const [addSubNodeDialog, setAddSubNodeDialog] = useState<{
    open: boolean;
    parentNodeId: string;
    parentNodeName: string;
    name: string;
    description: string;
  }>({ open: false, parentNodeId: "", parentNodeName: "", name: "", description: "" });

  const [generateKeywordsDialog, setGenerateKeywordsDialog] = useState<{
    open: boolean;
    nodeName: string;
    nodeCount: number;
  }>({ open: false, nodeName: "", nodeCount: 3 });

  const [googleSearchDialog, setGoogleSearchDialog] = useState<{
    open: boolean;
    searchTerm: string;
    searchResults: any[];
    geminiAnswer: string;
    isLoading: boolean;
  }>({ open: false, searchTerm: "", searchResults: [], geminiAnswer: "", isLoading: false });

  const [nodeDetailDialog, setNodeDetailDialog] = useState<{
    open: boolean;
    node: any | null;
  }>({ open: false, node: null });

  // Edit node mutation
  const editNodeMutation = useMutation({
    mutationFn: async (data: { nodeId: string; name: string; description: string }) => {
      const response = await apiRequest('PUT', `/api/node/${data.nodeId}`, {
        name: data.name,
        description: data.description
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/canvas/graph-data/${canvasId}`] });
      toast.success("Node Updated", {
        description: "Node has been successfully updated",
      });
      setEditDialog({ open: false, nodeId: "", name: "", description: "" });
    },
    onError: (error: Error) => {
      toast.error("Update Failed", {
        description: error.message || "Failed to update node",
      });
    },
  });

  // Add sub node mutation
  const addSubNodeMutation = useMutation({
    mutationFn: async (data: { parentNodeId: string; name: string; description: string; canvasId: string }) => {
      const response = await apiRequest('POST', `/api/node`, {
        name: data.name,
        description: data.description,
        canvasId: data.canvasId,
        parentNodeId: data.parentNodeId
      });
      return response.json();
    },
    onSuccess: () => {
      console.log("onSuccess", canvasId);
      queryClient.invalidateQueries({ queryKey: [`/api/canvas/graph-data/${canvasId}`] });
      toast.success("Sub Node Created", {
        description: "Sub node has been successfully created",
      });
      setAddSubNodeDialog({ open: false, parentNodeId: "", parentNodeName: "", name: "", description: "" });
    },
    onError: (error: any) => {
      toast.error("Creation Failed", {
        description: error.message || "Failed to create sub node",
      });
    },
  });

  // Google search with Gemini AI mutation
  const googleSearchMutation = useMutation({
    mutationFn: async (data: { searchTerm: string; nodeId: string }) => {
      const response = await apiRequest('POST', '/api/google-search', {
        query: data.searchTerm
      });
      const result = await response.json();
      return { ...result, nodeId: data.nodeId };
    },
    onSuccess: async (data) => {
      setGoogleSearchDialog(prev => ({
        ...prev,
        searchResults: data.searchResults || [],
        geminiAnswer: data.geminiAnswer || "",
        isLoading: false
      }));

      // Save the knowledge as metadata
      const knowledgeData = {
        searchResults: data.searchResults || [],
        geminiAnswer: data.geminiAnswer || "",
        searchDate: new Date().toISOString()
      };

      try {
        await apiRequest('PUT', `/api/node/${data.nodeId}`, {
          knowledge: JSON.stringify(knowledgeData)
        });
        
        // Refresh graph data to reflect the updated knowledge
        queryClient.invalidateQueries({ queryKey: [`/api/canvas/graph-data/${canvasId}`] });
        
        toast.success("Knowledge Saved", {
          description: "Search results saved as node knowledge",
        });
      } catch (error) {
        console.error("Failed to save knowledge:", error);
      }
    },
    onError: (error: any) => {
      toast.error("Search Failed", {
        description: error.message || "Failed to perform Google search",
      });
      setGoogleSearchDialog(prev => ({
        ...prev,
        isLoading: false
      }));
    },
  });

  // Handle Google search
  const handleGoogleSearch = (searchTerm: string, nodeId: string) => {
    setGoogleSearchDialog(prev => ({
      ...prev,
      open: true,
      searchTerm,
      searchResults: [],
      geminiAnswer: "",
      isLoading: true
    }));
    googleSearchMutation.mutate({ searchTerm, nodeId });
  };

  // Handle node detail view
  const handleShowNodeDetail = () => {
    const node = graphData?.nodes.find(n => n.id === contextMenu.nodeId);
    if (node) {
      setNodeDetailDialog({
        open: true,
        node
      });
    }
    hideContextMenu();
  };

  // Expose center graph functionality to parent
  useImperativeHandle(ref, () => ({
    centerGraph: () => {
      if (cyRef.current) {
        cyRef.current.fit(undefined, 80);
        cyRef.current.center();
      }
    },
    resetView: () => {
      if (cyRef.current) {
        cyRef.current.zoom(1);
        cyRef.current.center();
        cyRef.current.fit(undefined, 80);
      }
    }
  }));

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#1e40af',
            'label': 'data(label)',
            'color': '#ffffff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-family': 'Inter, sans-serif',
            'font-size': '13px',
            'font-weight': 'bold',
            'width': 100,
            'height': 100,
            'border-width': 3,
            'border-color': '#3b82f6',
            'text-wrap': 'wrap',
            'text-max-width': '85px',
            'shape': 'ellipse',
            'overlay-opacity': 0
          }
        },
        {
          selector: 'node.generated',
          style: {
            'background-color': '#7c3aed',
            'border-color': '#8b5cf6',
            'width': 80,
            'height': 80,
            'font-size': '11px'
          }
        },
        {
          selector: 'node.has-description',
          style: {
            'background-color': '#059669',
            // 'border-color': '#10b981'
          }
        },
        {
          selector: 'node.has-knowledge',
          style: {
            'border-color': '#10b981'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#f59e0b',
            'border-width': 3,
            'background-color': '#f59e0b',
            'overlay-opacity': 0
          }
        },
        {
          selector: 'node:active',
          style: {
            'width': 90,
            'height': 90,
            'border-width': 3,
            'overlay-opacity': 0
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.2,
            'opacity': 0.8
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#60a5fa',
            'target-arrow-color': '#60a5fa',
            'width': 4,
            'opacity': 1
          }
        }
      ],
      layout: {
        name: 'preset',
        animate: true,
        animationDuration: 800
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      selectionType: 'single',
      pixelRatio: 'auto',
      motionBlur: true,
      wheelSensitivity: 0.5,
      panningEnabled: true,
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      autoungrabify: false,
      autounselectify: false,
      minZoom: 0.1,
      maxZoom: 3,
      zoomingEnabled: true
    });

    // Touch and click event handlers
    let longPressTimer: NodeJS.Timeout | null = null;
    let isLongPress = false;

    // Right-click context menu (desktop)
    cyRef.current.on('cxttap', 'node', (event) => {
      event.preventDefault();
      const node = event.target;
      const position = event.renderedPosition || event.position;
      const adjustedPos = getContextMenuPosition(position.x, position.y);
      
      setContextMenu({
        visible: true,
        x: adjustedPos.x,
        y: adjustedPos.y,
        nodeId: node.id(),
        nodeName: node.data('name')
      });
      
      onNodeSelect(node.id());
    });

    // Touch start - begin long press detection
    cyRef.current.on('touchstart', 'node', (event) => {
      isLongPress = false;
      const node = event.target;
      
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        const position = event.renderedPosition || event.position;
        const adjustedPos = getContextMenuPosition(position.x, position.y);
        
        // Trigger haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        setContextMenu({
          visible: true,
          x: adjustedPos.x,
          y: adjustedPos.y,
          nodeId: node.id(),
          nodeName: node.data('name')
        });
        
        onNodeSelect(node.id());
      }, 500); // 500ms long press
    });

    // Touch end - cancel long press or handle tap
    cyRef.current.on('touchend', 'node', (event) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      
      if (!isLongPress) {
        // Regular tap
        const node = event.target;
        onNodeSelect(node.id());
        hideContextMenu();
      }
    });

    // Touch move - cancel long press
    cyRef.current.on('touchmove', 'node', () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      isLongPress = false;
    });

    // Regular tap for mouse/desktop
    cyRef.current.on('tap', 'node', (event) => {
      // Only handle if not a touch event
      if (event.originalEvent && event.originalEvent.type !== 'touchend') {
        const node = event.target;
        onNodeSelect(node.id());
        hideContextMenu();
      }
    });

    // Background tap/touch
    cyRef.current.on('tap', (event) => {
      if (event.target === cyRef.current) {
        onNodeSelect(null);
        hideContextMenu();
      }
    });

    cyRef.current.on('touchend', (event) => {
      if (event.target === cyRef.current) {
        onNodeSelect(null);
        hideContextMenu();
      }
    });



    // Hide context menu on outside click
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.context-menu')) {
        hideContextMenu();
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [onNodeSelect]);

  // Mind map layout with collision detection and proper spacing
  const applyImprovedLayout = (cy: Core, nodes: any[], edges: any[]) => {
    const originalNodes = nodes.filter(n => n.type === 'original');
    
    // Build parent-child relationships
    const children: { [key: string]: string[] } = {};
    const parents: { [key: string]: string } = {};
    
    edges.forEach(edge => {
      if (!children[edge.source]) children[edge.source] = [];
      children[edge.source].push(edge.target);
      parents[edge.target] = edge.source;
    });
    
    const centerX = 0;
    const centerY = 0;
    const positioned = new Set<string>();
    const positionedNodes: { [key: string]: { x: number; y: number } } = {};
    const minDistance = 140; // Minimum distance between any two nodes
    
    // Collision detection helper
    const isPositionValid = (x: number, y: number, excludeId?: string) => {
      for (const [nodeId, pos] of Object.entries(positionedNodes)) {
        if (nodeId === excludeId) continue;
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance < minDistance) return false;
      }
      return true;
    };
    
    // Find valid position with collision avoidance
    const findValidPosition = (targetX: number, targetY: number, excludeId?: string) => {
      if (isPositionValid(targetX, targetY, excludeId)) {
        return { x: targetX, y: targetY };
      }
      
      // Try positions in expanding circles
      for (let radius = minDistance; radius <= minDistance * 4; radius += 30) {
        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 12) {
          const x = targetX + radius * Math.cos(angle);
          const y = targetY + radius * Math.sin(angle);
          
          if (isPositionValid(x, y, excludeId)) {
            return { x, y };
          }
        }
      }
      
      return { x: targetX, y: targetY }; // Fallback
    };
    
    if (originalNodes.length === 0) return;
    
    if (originalNodes.length === 1) {
      // Classic mind map - single central node
      const rootNode = originalNodes[0];
      const rootElement = cy.getElementById(rootNode.id);
      rootElement.position({ x: centerX, y: centerY });
      positioned.add(rootNode.id);
      positionedNodes[rootNode.id] = { x: centerX, y: centerY };
      
      // Get all children and organize them in branches
      const directChildren = children[rootNode.id] || [];
      
      if (directChildren.length > 0) {
        // Distribute main branches around the center with increased radius
        const branchAngleStep = (2 * Math.PI) / directChildren.length;
        const mainBranchRadius = 320; // Increased from 280
        
        directChildren.forEach((childId, branchIndex) => {
          const branchAngle = branchIndex * branchAngleStep - Math.PI / 2;
          
          // Position first level child with collision detection
          const targetX = centerX + mainBranchRadius * Math.cos(branchAngle);
          const targetY = centerY + mainBranchRadius * Math.sin(branchAngle);
          const validPos = findValidPosition(targetX, targetY, childId);
          
          const childElement = cy.getElementById(childId);
          childElement.position({ x: validPos.x, y: validPos.y });
          positioned.add(childId);
          positionedNodes[childId] = validPos;
          
          // Position subsequent levels along the branch
          const positionBranch = (parentId: string, parentX: number, parentY: number, angle: number, level: number) => {
            const branchChildren = children[parentId] || [];
            if (branchChildren.length === 0) return;
            
            const levelDistance = Math.max(180, 220 - (level * 20)); // Increased minimum distance
            const spreadAngle = Math.PI / 2.5; // Wider spread to reduce overlap
            const angleStep = branchChildren.length > 1 ? spreadAngle / (branchChildren.length - 1) : 0;
            const startAngle = angle - spreadAngle / 2;
            
            branchChildren.forEach((branchChildId, index) => {
              if (positioned.has(branchChildId)) return;
              
              const childAngle = branchChildren.length === 1 ? angle : startAngle + (index * angleStep);
              const targetX = parentX + levelDistance * Math.cos(childAngle);
              const targetY = parentY + levelDistance * Math.sin(childAngle);
              const validPos = findValidPosition(targetX, targetY, branchChildId);
              
              const branchChildElement = cy.getElementById(branchChildId);
              branchChildElement.position({ x: validPos.x, y: validPos.y });
              positioned.add(branchChildId);
              positionedNodes[branchChildId] = validPos;
              
              // Continue the branch recursively
              positionBranch(branchChildId, validPos.x, validPos.y, childAngle, level + 1);
            });
          };
          
          // Position the rest of this branch
          positionBranch(childId, validPos.x, validPos.y, branchAngle, 1);
        });
      }
    } else {
      // Multiple root nodes - arrange in sectors with increased spacing
      const sectorAngle = (2 * Math.PI) / originalNodes.length;
      const rootDistance = 300; // Increased from 250
      
      originalNodes.forEach((rootNode, index) => {
        const rootAngle = index * sectorAngle;
        const targetX = centerX + rootDistance * Math.cos(rootAngle);
        const targetY = centerY + rootDistance * Math.sin(rootAngle);
        const validPos = findValidPosition(targetX, targetY, rootNode.id);
        
        const rootElement = cy.getElementById(rootNode.id);
        rootElement.position({ x: validPos.x, y: validPos.y });
        positioned.add(rootNode.id);
        positionedNodes[rootNode.id] = validPos;
        
        // Each root gets its own sector
        const sectorChildren = children[rootNode.id] || [];
        if (sectorChildren.length > 0) {
          const sectorSpread = Math.PI / 1.8; // Wider sector spread
          const childAngleStep = sectorChildren.length > 1 ? sectorSpread / (sectorChildren.length - 1) : 0;
          const sectorStartAngle = rootAngle - sectorSpread / 2;
          
          sectorChildren.forEach((childId, childIndex) => {
            if (positioned.has(childId)) return;
            
            const childAngle = sectorChildren.length === 1 ? rootAngle : sectorStartAngle + (childIndex * childAngleStep);
            const childDistance = 220; // Increased from 180
            const targetX = validPos.x + childDistance * Math.cos(childAngle);
            const targetY = validPos.y + childDistance * Math.sin(childAngle);
            const childValidPos = findValidPosition(targetX, targetY, childId);
            
            const childElement = cy.getElementById(childId);
            childElement.position({ x: childValidPos.x, y: childValidPos.y });
            positioned.add(childId);
            positionedNodes[childId] = childValidPos;
            
            // Position grandchildren with better spacing
            const grandchildren = children[childId] || [];
            if (grandchildren.length > 0) {
              const grandDistance = 160; // Increased from 120
              const grandSpread = Math.PI / 3; // Wider spread
              const grandAngleStep = grandchildren.length > 1 ? grandSpread / (grandchildren.length - 1) : 0;
              const grandStartAngle = childAngle - grandSpread / 2;
              
              grandchildren.forEach((grandId, grandIndex) => {
                if (positioned.has(grandId)) return;
                
                const grandAngle = grandchildren.length === 1 ? childAngle : grandStartAngle + (grandIndex * grandAngleStep);
                const targetGrandX = childValidPos.x + grandDistance * Math.cos(grandAngle);
                const targetGrandY = childValidPos.y + grandDistance * Math.sin(grandAngle);
                const grandValidPos = findValidPosition(targetGrandX, targetGrandY, grandId);
                
                const grandElement = cy.getElementById(grandId);
                grandElement.position({ x: grandValidPos.x, y: grandValidPos.y });
                positioned.add(grandId);
                positionedNodes[grandId] = grandValidPos;
              });
            }
          });
        }
      });
    }
    
    // Position any remaining orphaned nodes
    const unpositioned = nodes.filter(n => !positioned.has(n.id));
    if (unpositioned.length > 0) {
      const orphanRadius = 600; // Increased radius
      const orphanAngleStep = (2 * Math.PI) / Math.max(unpositioned.length, 1);
      
      unpositioned.forEach((node, index) => {
        const angle = index * orphanAngleStep;
        const targetX = centerX + orphanRadius * Math.cos(angle);
        const targetY = centerY + orphanRadius * Math.sin(angle);
        const validPos = findValidPosition(targetX, targetY, node.id);
        
        const nodeElement = cy.getElementById(node.id);
        nodeElement.position({ x: validPos.x, y: validPos.y });
        positionedNodes[node.id] = validPos;
      });
    }
  };

  // Update graph data
  useEffect(() => {
    if (!cyRef.current || !graphData) return;

    const elements = [
      ...graphData.nodes.map(node => {
        const classes = [];
        if (node.type === 'generated') classes.push('generated');
        if (node.description && node.description.trim()) classes.push('has-description');
        if (node.knowledge && node.knowledge.trim()) classes.push('has-knowledge');
        
        return {
          group: 'nodes' as const,
          data: {
            id: node.id,
            label: node.name,
            name: node.name,
            type: node.type,
            description: node.description
          },
          classes: classes.join(' '),
          position: { x: 0, y: 0 }
        };
      }),
      ...graphData.edges.map(edge => ({
        group: 'edges' as const,
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target
        }
      }))
    ];

    cyRef.current.elements().remove();
    cyRef.current.add(elements);
    
    // Apply improved layout
    setTimeout(() => {
      if (cyRef.current) {
        applyImprovedLayout(cyRef.current, graphData.nodes, graphData.edges);
        cyRef.current.fit(undefined, 80);
      }
    }, 50);

  }, [graphData]);

  // Update selected node
  useEffect(() => {
    if (!cyRef.current) return;

    cyRef.current.nodes().removeClass('selected');
    if (selectedNodeId) {
      cyRef.current.getElementById(selectedNodeId).addClass('selected');
    }
  }, [selectedNodeId]);

  const hideContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // Calculate context menu position to keep it within viewport
  const getContextMenuPosition = (x: number, y: number) => {
    const menuWidth = 200; // Approximate menu width
    const menuHeight = 120; // Approximate menu height
    const padding = 10;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    // Adjust horizontal position
    if (x + menuWidth + padding > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - padding;
    }
    if (adjustedX < padding) {
      adjustedX = padding;
    }
    
    // Adjust vertical position
    if (y + menuHeight + padding > viewportHeight) {
      adjustedY = y - menuHeight - padding;
    }
    if (adjustedY < padding) {
      adjustedY = padding;
    }
    
    return { x: adjustedX, y: adjustedY };
  };

  const handleGenerateKeywords = () => {
    setGenerateKeywordsDialog({
      open: true,
      nodeName: contextMenu.nodeName,
      nodeCount: 3
    });
    hideContextMenu();
  };

  const handleDeleteNode = () => {
    onDeleteNode(contextMenu.nodeId);
    hideContextMenu();
  };

  const handleEditNode = () => {
    const node = graphData?.nodes.find(n => n.id === contextMenu.nodeId);
    if (node) {
      setEditDialog({
        open: true,
        nodeId: contextMenu.nodeId,
        name: node.name,
        description: node.description || ""
      });
    }
    hideContextMenu();
  };

  const handleSaveEdit = () => {
    if (editDialog.name.trim()) {
      editNodeMutation.mutate({
        nodeId: editDialog.nodeId,
        name: editDialog.name.trim(),
        description: editDialog.description
      });
    }
  };

  const handleAddSubNode = () => {
    const node = graphData?.nodes.find(n => n.id === contextMenu.nodeId);
    if (node) {
      setAddSubNodeDialog({
        open: true,
        parentNodeId: contextMenu.nodeId,
        parentNodeName: node.name,
        name: "",
        description: ""
      });
    }
    hideContextMenu();
  };

  const handleGenerateNodes = () => {
    onGenerateKeywords(generateKeywordsDialog.nodeName, generateKeywordsDialog.nodeCount);
    setGenerateKeywordsDialog({ open: false, nodeName: "", nodeCount: 3 });
  };

  const handleSaveSubNode = () => {
    if (addSubNodeDialog.name.trim()) {
      addSubNodeMutation.mutate({
        parentNodeId: addSubNodeDialog.parentNodeId,
        name: addSubNodeDialog.name.trim(),
        description: addSubNodeDialog.description,
        canvasId: canvasId
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Graph Container */}
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300 font-medium">{loadingMessage || "Loading graph..."}</p>
            {loadingMessage && (
              <p className="text-slate-400 text-sm mt-1">This may take a few seconds</p>
            )}
          </div>
        </div>
      )}
      
      {/* Context Menu - Mobile Optimized */}
      {contextMenu.visible && (
        <div
          className="fixed bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-1 shadow-xl z-20 min-w-[180px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <div
            className="flex items-center space-x-2 px-3 py-3 sm:py-2 text-sm text-slate-50 hover:bg-blue-600/10 hover:text-blue-400 rounded cursor-pointer transition-colors touch-manipulation"
            onClick={handleGenerateKeywords}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span>Generate Keywords</span>
          </div>
          <div
            className="flex items-center space-x-2 px-3 py-3 sm:py-2 text-sm text-slate-50 hover:bg-purple-600/10 hover:text-purple-400 rounded cursor-pointer transition-colors touch-manipulation"
            onClick={handleAddSubNode}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add Sub Node</span>
          </div>
          <div
            className="flex items-center space-x-2 px-3 py-3 sm:py-2 text-sm text-slate-50 hover:bg-green-600/10 hover:text-green-400 rounded cursor-pointer transition-colors touch-manipulation"
            onClick={handleEditNode}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span>Edit Node</span>
          </div>
          <div
            className="flex items-center space-x-2 px-3 py-3 sm:py-2 text-sm text-slate-50 hover:bg-blue-600/10 hover:text-blue-400 rounded cursor-pointer transition-colors touch-manipulation"
            onClick={() => { handleGoogleSearch(contextMenu.nodeName, contextMenu.nodeId); hideContextMenu(); }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>Search with Google</span>
          </div>
          <div
            className="flex items-center space-x-2 px-3 py-3 sm:py-2 text-sm text-slate-50 hover:bg-yellow-600/10 hover:text-yellow-400 rounded cursor-pointer transition-colors touch-manipulation"
            onClick={handleShowNodeDetail}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>See Detail</span>
          </div>
          <div
            className="flex items-center space-x-2 px-3 py-3 sm:py-2 text-sm text-slate-50 hover:bg-red-600/10 hover:text-red-400 rounded cursor-pointer transition-colors touch-manipulation"
            onClick={handleDeleteNode}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>Delete Node</span>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditNodeModal
        open={editDialog.open}
        name={editDialog.name}
        description={editDialog.description}
        isLoading={editNodeMutation.isPending}
        onOpenChange={(open) => setEditDialog(prev => ({ ...prev, open }))}
        onNameChange={(name) => setEditDialog(prev => ({ ...prev, name }))}
        onDescriptionChange={(description) => setEditDialog(prev => ({ ...prev, description }))}
        onSave={handleSaveEdit}
        onCancel={() => setEditDialog({ open: false, nodeId: "", name: "", description: "" })}
      />

      {/* Add Sub Node Dialog */}
      <AddSubNodeModal
        open={addSubNodeDialog.open}
        parentNodeName={addSubNodeDialog.parentNodeName}
        name={addSubNodeDialog.name}
        description={addSubNodeDialog.description}
        isLoading={addSubNodeMutation.isPending}
        onOpenChange={(open) => setAddSubNodeDialog(prev => ({ ...prev, open }))}
        onNameChange={(name) => setAddSubNodeDialog(prev => ({ ...prev, name }))}
        onDescriptionChange={(description) => setAddSubNodeDialog(prev => ({ ...prev, description }))}
        onSave={handleSaveSubNode}
        onCancel={() => setAddSubNodeDialog({ open: false, parentNodeId: "", parentNodeName: "", name: "", description: "" })}
      />

      {/* Generate Keywords Modal */}
      <GenerateKeywordsModal
        open={generateKeywordsDialog.open}
        nodeName={generateKeywordsDialog.nodeName}
        nodeCount={generateKeywordsDialog.nodeCount}
        onOpenChange={(open) => setGenerateKeywordsDialog(prev => ({ ...prev, open }))}
        onNodeCountChange={(nodeCount) => setGenerateKeywordsDialog(prev => ({ ...prev, nodeCount }))}
        onGenerate={handleGenerateNodes}
        onCancel={() => setGenerateKeywordsDialog({ open: false, nodeName: "", nodeCount: 3 })}
      />

      {/* Google Search with Gemini AI Modal */}
      <GoogleSearchModal
        open={googleSearchDialog.open}
        searchTerm={googleSearchDialog.searchTerm}
        searchResults={googleSearchDialog.searchResults}
        geminiAnswer={googleSearchDialog.geminiAnswer}
        isLoading={googleSearchDialog.isLoading}
        onOpenChange={(open) => setGoogleSearchDialog(prev => ({ ...prev, open }))}
        onClose={() => setGoogleSearchDialog(prev => ({ ...prev, open: false }))}
      />

      {/* Node Detail Modal */}
      <NodeDetailModal
        open={nodeDetailDialog.open}
        node={nodeDetailDialog.node}
        onOpenChange={(open) => setNodeDetailDialog(prev => ({ ...prev, open }))}
        onClose={() => setNodeDetailDialog(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
});

GraphCanvas.displayName = 'GraphCanvas';

export default GraphCanvas;
