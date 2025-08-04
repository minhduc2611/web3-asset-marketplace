"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Split, Download, Undo2 } from "lucide-react";

interface Chunk {
  id: string;
  text: string;
  name: string;
  description: string;
  startIndex: number;
  endIndex: number;
}

// Type for enhanced document methods
interface CaretPositionFromPoint {
  offsetNode: Node;
  offset: number;
}

interface DocumentWithCaretMethods {
  caretPositionFromPoint?: (
    x: number,
    y: number
  ) => CaretPositionFromPoint | null;
}

interface TextChunkerProps {
  text: string;
  filename?: string;
  onChunksChange?: (chunks: Chunk[]) => void;
}

export default function TextChunker({
  text,
  filename,
  onChunksChange,
}: TextChunkerProps) {
  const originalText = text;
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [chunksHistory, setChunksHistory] = useState<Chunk[][]>([]);

  // Get clean filename without extension for naming
  const getCleanFilename = () => {
    if (!filename) return "Document";
    return filename.replace(/\.[^/.]+$/, "");
  };

  // Initialize chunks when text is provided
  useEffect(() => {
    if (originalText.trim()) {
      const cleanFilename = getCleanFilename();
      console.log(cleanFilename);
      const initialChunks = [
        {
          id: "chunk-0",
          text: originalText,
          name: `Chunk 1`,
          description: "",
          startIndex: 0,
          endIndex: originalText.length,
        },
      ];
      setChunks(initialChunks);
      onChunksChange?.(initialChunks);
    } else {
      setChunks([]);
      onChunksChange?.([]);
    }
    setChunksHistory([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalText]);

  // Call onChunksChange whenever chunks change
  useEffect(() => {
    onChunksChange?.(chunks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks]);

  const handleChunkClick = (
    chunkId: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const chunkIndex = chunks.findIndex((c) => c.id === chunkId);
    if (chunkIndex === -1) return;

    const chunk = chunks[chunkIndex];
    if (!chunk.text) return;

    // Get the click position within this specific chunk
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create a range from the click point
    let range: Range;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x + rect.left, y + rect.top)!;
    } else if ((document as DocumentWithCaretMethods).caretPositionFromPoint) {
      const caretPosition = (document as DocumentWithCaretMethods)
        .caretPositionFromPoint!(x + rect.left, y + rect.top);
      if (!caretPosition) return;
      range = document.createRange();
      range.setStart(caretPosition.offsetNode, caretPosition.offset);
    } else {
      return;
    }

    if (!range) return;

    // Calculate the position within this chunk's text
    let clickPosition = 0;
    const walker = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode === range.startContainer) {
        clickPosition += range.startOffset;
        break;
      } else {
        clickPosition += currentNode.textContent?.length || 0;
      }
    }

    // Ensure position is within bounds and not at the very beginning or end
    clickPosition = Math.max(1, Math.min(clickPosition, chunk.text.length - 1));

    // Don't split if click is too close to the edges
    if (clickPosition <= 1 || clickPosition >= chunk.text.length - 1) {
      return;
    }

    // Save current state to history
    setChunksHistory([...chunksHistory, chunks]);

    // Split the chunk into two parts
    const firstPart = chunk.text.slice(0, clickPosition);
    const secondPart = chunk.text.slice(clickPosition);

    const newChunks = [...chunks];

    // Replace the clicked chunk with two new chunks
    newChunks[chunkIndex] = {
      id: `chunk-${Date.now()}-1`,
      text: firstPart,
      name: `${chunk.name} - Part 1`,
      description: chunk.description,
      startIndex: chunk.startIndex,
      endIndex: chunk.startIndex + clickPosition,
    };

    // Insert the second chunk right after the first
    newChunks.splice(chunkIndex + 1, 0, {
      id: `chunk-${Date.now()}-2`,
      text: secondPart,
      name: `${chunk.name} - Part 2`,
      description: "",
      startIndex: chunk.startIndex + clickPosition,
      endIndex: chunk.endIndex,
    });

    // Renumber all chunks
    // const renumberedChunks = newChunks.map((c, index) => ({
    //   ...c,
    //   name: `${getCleanFilename()} Chunk ${index + 1}`,
    // }));

    setChunks(newChunks);
  };

  const updateChunk = (
    chunkId: string,
    field: "name" | "description",
    value: string
  ) => {
    setChunks(
      chunks.map((chunk) =>
        chunk.id === chunkId ? { ...chunk, [field]: value } : chunk
      )
    );
  };

  const resetChunks = () => {
    if (originalText.trim()) {
      const cleanFilename = getCleanFilename();
      setChunks([
        {
          id: "chunk-0",
          text: originalText,
          name: `${cleanFilename} Chunk 1`,
          description: "",
          startIndex: 0,
          endIndex: originalText.length,
        },
      ]);
    } else {
      setChunks([]);
    }
    setChunksHistory([]);
  };

  const undoLastSplit = () => {
    if (chunksHistory.length === 0) return;

    const previousChunks = chunksHistory[chunksHistory.length - 1];
    setChunks(previousChunks);
    setChunksHistory(chunksHistory.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        undoLastSplit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunksHistory]);

  const exportChunks = () => {
    const exportData = {
      originalText,
      chunks: chunks.map((chunk) => ({
        name: chunk.name,
        description: chunk.description,
        text: chunk.text,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-chunks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Don't render anything if there's no text
  if (!originalText?.trim()) {
    return (
      <div className="text-center py-8 text-slate-400">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No text provided for chunking</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-slate-50">Text Chunker</h2>
      </div>

      <p className="text-sm text-slate-300">
        Click anywhere in any chunk to split it into two parts. Each chunk can
        be named and described. Use Ctrl+Z (or Cmd+Z on Mac) to undo the last
        split.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={resetChunks}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-slate-600 hover:bg-slate-700"
        >
          <Split className="h-4 w-4" />
          Reset Chunks
        </Button>
        {chunks.length > 1 && (
          <Button
            onClick={exportChunks}
            size="sm"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4" />
            Export Chunks
          </Button>
        )}
        {chunksHistory.length > 0 && (
          <Button
            onClick={undoLastSplit}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-slate-600 hover:bg-slate-700"
          >
            <Undo2 className="h-4 w-4" />
            Undo Split
          </Button>
        )}
      </div>

      {/* Chunk Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-100 flex items-center gap-2">
          <Split className="h-5 w-5" />
          Text Chunks ({chunks.length})
        </h3>

        {chunks.map((chunk, index) => (
          <Card
            key={chunk.id}
            className="bg-slate-800 border-slate-600 overflow-hidden"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-slate-100">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: `hsl(${(index * 137.5) % 360}, 60%, 60%)`,
                  }}
                />
                {chunk.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Chunk Text - Clickable for splitting */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">
                    Text Content (Click to Split)
                  </Label>
                  <div
                    onClick={(e) => handleChunkClick(chunk.id, e)}
                    className="text-sm leading-relaxed p-3 border border-slate-600 rounded-lg cursor-text hover:bg-slate-700/50 transition-colors bg-slate-700/30"
                    style={{
                      userSelect: "text",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <span className="text-slate-200">{chunk.text}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {chunk.text.length} characters • Click anywhere in the text
                    above to split this chunk
                  </p>
                </div>

                {/* Chunk Form */}
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor={`name-${chunk.id}`}
                      className="text-sm text-slate-300"
                    >
                      Name/Title
                    </Label>
                    <Input
                      id={`name-${chunk.id}`}
                      value={chunk.name}
                      onChange={(e) =>
                        updateChunk(chunk.id, "name", e.target.value)
                      }
                      placeholder="Enter chunk name..."
                      className="text-sm bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`desc-${chunk.id}`}
                      className="text-sm text-slate-300"
                    >
                      Description
                    </Label>
                    <Textarea
                      id={`desc-${chunk.id}`}
                      value={chunk.description}
                      onChange={(e) =>
                        updateChunk(chunk.id, "description", e.target.value)
                      }
                      placeholder="Describe this chunk..."
                      className="min-h-[80px] text-sm bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-slate-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
