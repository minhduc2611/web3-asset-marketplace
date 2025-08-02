"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Network,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useAppState from "@/store/useAppState";
import { useCanvases, useCreateCanvas } from "@/hooks/use-canvas";

export default function CanvasList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [canvasName, setCanvasName] = useState("");
  const { user } = useAppState();
  const authorId = user?.id || "";
  const router = useRouter();
  
  // Fetch user's canvases using the new hook
  const { data: response, isLoading } = useCanvases({
    author_id: authorId,
    limit: 50,
    offset: 0,
  });

  // Create canvas mutation using the new hook
  const createCanvasMutation = useCreateCanvas();

  const handleCreateCanvas = () => {
    if (!canvasName.trim()) return;

    createCanvasMutation.mutate({
      name: canvasName.trim(),
      authorId,
    });
    setIsCreateDialogOpen(false);
    setCanvasName("");
  };
  
  const { isPending: isCreating } = createCanvasMutation;
  
  // Extract canvases from the response
  const canvases = response?.data || [];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Floating Elements Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            className="absolute w-3 h-3 bg-blue-500/20 rounded-full blur-sm"
            style={{
              left: `${10 + i * 10}%`,
              top: `${15 + i * 8}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-3 mb-3"
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                >
                  <Network className="w-3 h-3 mr-1" />
                  Graph Explorer
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-600/20 text-green-300 border-green-600/30"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </motion.div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                Keyword Explorer
              </h1>
              <p className="text-slate-400 text-lg">
                Create and explore AI-powered mind maps with interactive
                visualizations
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600/30 border-t-blue-500 rounded-full"
                />
                <p className="text-slate-400">Loading your canvases...</p>
              </div>
            </motion.div>
          ) : canvases && canvases.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Your Canvases
                </h2>
                <p className="text-slate-400">
                  Explore and manage your keyword exploration workspaces
                </p>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {canvases.map((canvas, index) => (
                  <motion.div
                    key={canvas.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Link href={`/canvas/${canvas.id}`}>
                      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
                                <Network className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-white group-hover:text-blue-300 transition-colors truncate text-lg">
                                  {canvas.name}
                                </CardTitle>
                                <CardDescription className="text-slate-400 mt-1">
                                  AI-powered mind map
                                </CardDescription>
                              </div>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              whileHover={{ opacity: 1, x: 0 }}
                              className="text-blue-400"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>
                                {canvas.created_at ? new Date(
                                  canvas.created_at
                                ).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-green-600/20 text-green-300 border-green-600/30 text-xs"
                            >
                              Active
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto mb-6 p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl w-fit border border-blue-500/30"
              >
                <Network className="w-16 h-16 text-blue-400" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-4">
                No canvases yet
              </h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Create your first canvas to start exploring keywords and
                building mind maps with AI
              </p>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Canvas
                  </Button>
                </DialogTrigger>
              </Dialog>
            </motion.div>
          )}
        </div>
      </section>

      {/* Floating Action Button for Create Canvas */}
      {canvases && canvases.length >= 0 && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 flex flex-row gap-2"
          >
            <Button
              size="lg"
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-full w-16 h-16 shadow-2xl shadow-blue-500/25"
              title="Go back to home"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-16 h-16 shadow-2xl shadow-blue-500/25"
                title="Create new canvas"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
          </motion.div>

          <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600/50 backdrop-blur-sm max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                Create New Canvas
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Give your new keyword exploration canvas a descriptive name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="canvas-name" className="text-slate-300">
                  Canvas Name
                </Label>
                <Input
                  id="canvas-name"
                  value={canvasName}
                  onChange={(e) => setCanvasName(e.target.value)}
                  placeholder="e.g., Machine Learning Research"
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-slate-600/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCanvas}
                disabled={!canvasName.trim() || isCreating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Canvas"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
