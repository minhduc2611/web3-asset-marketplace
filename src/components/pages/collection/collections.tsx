"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BookOpen,
  Plus,
  Search,
  Brain,
  Zap,
  Sparkles,
  Target,
  Clock,
  Edit,
  Save,
  X,
  MoreVertical,
  Share2,
  Upload,
  Download,
  Copy,
  Globe,
  Lock,
  Store,
  Trash2,
  Eye,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Available tags for marketplace publishing
const availableTags = [
  "javascript",
  "programming",
  "web-development",
  "react",
  "nodejs",
  "spanish",
  "language",
  "vocabulary",
  "grammar",
  "conversation",
  "biology",
  "science",
  "education",
  "chemistry",
  "physics",
  "medical",
  "healthcare",
  "terminology",
  "anatomy",
  "nursing",
  "history",
  "geography",
  "literature",
  "mathematics",
  "calculus",
  "business",
  "marketing",
  "finance",
  "economics",
  "management",
  "art",
  "design",
  "photography",
  "music",
  "cooking",
  "technology",
  "ai",
  "machine-learning",
  "data-science",
  "python",
];

// Mock flashcards for preview selection
const mockFlashcards = [
  {
    id: "fc1",
    front: "What is a closure in JavaScript?",
    back: "A closure is a function that has access to variables in its outer scope even after the outer function has returned.",
  },
  {
    id: "fc2",
    front: "Explain React hooks",
    back: "React hooks are functions that let you use state and other React features in functional components.",
  },
  {
    id: "fc3",
    front: "What is the difference between let and var?",
    back: "let is block-scoped while var is function-scoped. let also prevents redeclaration in the same scope.",
  },
  {
    id: "fc4",
    front: "What is async/await?",
    back: "Async/await is a syntax that makes it easier to work with promises in JavaScript, allowing asynchronous code to be written in a synchronous style.",
  },
  {
    id: "fc5",
    front: "What is the virtual DOM?",
    back: "The virtual DOM is a JavaScript representation of the actual DOM that React uses to optimize rendering performance.",
  },
];

// Mock data for now
const mockCollections = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    description: "Core concepts of JavaScript programming language",
    cardCount: 45,
    nextReview: "2025-06-16T10:00:00Z",
    difficulty: "Medium",
    authorId: "user1",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
  },
  {
    id: "2",
    name: "React Hooks",
    description: "Master modern React hooks and state management",
    cardCount: 28,
    nextReview: "2025-06-16T14:30:00Z",
    difficulty: "Hard",
    authorId: "user1",
    createdAt: "2025-06-05T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
  },
  {
    id: "3",
    name: "TypeScript Basics",
    description: "Essential TypeScript concepts and syntax",
    cardCount: 32,
    nextReview: "2025-06-17T09:15:00Z",
    difficulty: "Easy",
    authorId: "user1",
    createdAt: "2025-06-10T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
  },
];

export default function Collections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [collectionToShare, setCollectionToShare] = useState<any>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [collectionToPublish, setCollectionToPublish] = useState<any>(null);
  const [publishData, setPublishData] = useState({
    imageUrl: "",
    tags: [] as string[],
    difficulty: "beginner",
    price: "0",
    previewCards: [] as string[],
  });
  const queryClient = useQueryClient();

  const filteredCollections = mockCollections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600/20 text-green-300 border-green-600/30";
      case "Medium":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-600/30";
      case "Hard":
        return "bg-red-600/20 text-red-300 border-red-600/30";
      default:
        return "bg-blue-600/20 text-blue-300 border-blue-600/30";
    }
  };

  const formatNextReview = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffHours <= 0) return "Review now";
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays}d`;
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error("Validation Error", {
        description: "Collection name is required",
      });
      return;
    }

    // Here we would typically make an API call
    toast.success("Collection Created", {
      description: `Successfully created "${newCollectionName}"`,
    });

    setShowCreateModal(false);
    setNewCollectionName("");
    setNewCollectionDescription("");
  };

  const handleDeleteCollection = async () => {
    if (!collectionToDelete) return;

    try {
      await apiRequest("DELETE", `/api/collections/${collectionToDelete}`);
      toast.success("Collection Deleted", {
        description: "Collection has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    } catch (error) {
      toast.error("Delete Failed", {
        description: "Failed to delete collection. Please try again.",
      });
    }

    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const handleShareCollection = async (collectionId: string) => {
    try {
      const shareUrl = `${window.location.origin}/collections/${collectionId}/shared`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link Copied", {
        description: "Share link copied to clipboard.",
      });
    } catch (error) {
      toast.error("Copy Failed", {
        description: "Failed to copy link. Please try again.",
      });
    }
  };

  const handlePublishToMarketplace = async () => {
    if (!collectionToPublish) return;

    try {
      await apiRequest(
        "POST",
        `/api/collections/${collectionToPublish.id}/publish`,
        {
          ...publishData,
          collectionId: collectionToPublish.id,
        }
      );
      toast.success("Published Successfully", {
        description: "Collection is now available in the marketplace.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    } catch (error) {
      toast.error("Publish Failed", {
        description: "Failed to publish collection. Please try again.",
      });
    }

    setPublishDialogOpen(false);
    setCollectionToPublish(null);
    setPublishData({
      imageUrl: "",
      tags: [],
      difficulty: "beginner",
      price: "0",
      previewCards: [],
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPublishData((prev) => ({
          ...prev,
          imageUrl: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setPublishData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const togglePreviewCard = (cardId: string) => {
    setPublishData((prev) => ({
      ...prev,
      previewCards: prev.previewCards.includes(cardId)
        ? prev.previewCards.filter((id) => id !== cardId)
        : [...prev.previewCards, cardId],
    }));
  };

  const handleDuplicateCollection = async (collectionId: string) => {
    try {
      await apiRequest("POST", `/api/collections/${collectionId}/duplicate`);
      toast.success("Collection Duplicated", {
        description: "A copy of the collection has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    } catch (error) {
      toast.error("Duplicate Failed", {
        description: "Failed to duplicate collection. Please try again.",
      });
    }
  };

  const handleExportCollection = async (collectionId: string) => {
    try {
      const response = await apiRequest(
        "GET",
        `/api/collections/${collectionId}/export`
      );
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `collection-${collectionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Export Complete", {
        description: "Collection exported successfully.",
      });
    } catch (error) {
      toast.error("Export Failed", {
        description: "Failed to export collection. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
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
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            className="absolute w-3 h-3 bg-purple-500/20 rounded-full blur-sm"
            style={{
              left: `${10 + i * 11}%`,
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
        className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-6 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Flashcard Studio
                </h1>
                <p className="text-slate-400 mt-1">
                  Master any subject with spaced repetition
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 border-purple-600/30"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  {mockCollections.length} Collections
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {mockCollections.reduce(
                    (sum, col) => sum + col.cardCount,
                    0
                  )}{" "}
                  Cards
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/marketplace">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Marketplace</span>
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Collection</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative max-w-md"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
            />
          </motion.div>
        </div>
      </motion.header>

      {/* Collections Grid */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm group-hover:border-purple-500/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/collections/${collection.id}`}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <h3 className="font-semibold text-lg text-white group-hover:text-purple-200 transition-colors truncate">
                          {collection.name}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(collection.difficulty)}
                        >
                          {collection.difficulty}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white hover:bg-slate-600 p-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="bg-slate-800 border-slate-600"
                            align="end"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/collections/${collection.id}`;
                              }}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Collection
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/collections/${collection.id}/manage`;
                              }}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Manage Cards
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-600" />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareCollection(collection.id);
                              }}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateCollection(collection.id);
                              }}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExportCollection(collection.id);
                              }}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-600" />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCollectionToPublish(collection);
                                setPublishDialogOpen(true);
                              }}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Publish to Marketplace
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-600" />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCollectionToDelete(collection.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-400 hover:bg-red-900/30"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Target className="w-4 h-4 text-purple-400" />
                          <span>{collection.cardCount} cards</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>{formatNextReview(collection.nextReview)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                        <span className="text-xs text-slate-500">
                          Updated{" "}
                          {new Date(collection.updatedAt).toLocaleDateString()}
                        </span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredCollections.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-16"
            >
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 inline-block mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No collections found
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm
                  ? `No collections match "${searchTerm}"`
                  : "Start by creating your first collection"}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md bg-slate-900/95 border-slate-700 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                <Plus className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Create New Collection
                </DialogTitle>
                <p className="text-slate-400 text-sm mt-1">
                  Start organizing your flashcards
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Spanish Vocabulary"
                className="bg-slate-800/50 border-slate-600 text-white"
                style={{ fontSize: "16px" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection-description">
                Description (Optional)
              </Label>
              <Textarea
                id="collection-description"
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="Describe what you'll learn in this collection..."
                className="bg-slate-800/50 border-slate-600 text-white resize-none"
                rows={3}
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCreateCollection}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-600 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to delete this collection? This action
              cannot be undone and will permanently remove all flashcards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCollection}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish to Marketplace Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="max-w-4xl bg-slate-900/95 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Publish to Marketplace
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-slate-300 text-sm">
              Publishing "{collectionToPublish?.name}" will make it available
              for others to discover and download in the marketplace.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    Collection Image
                  </Label>
                  <div className="space-y-3">
                    {publishData.imageUrl ? (
                      <div className="relative">
                        <img
                          src={publishData.imageUrl}
                          alt="Collection preview"
                          className="w-full h-32 object-cover rounded-lg border border-slate-600"
                        />
                        <Button
                          onClick={() =>
                            setPublishData((prev) => ({
                              ...prev,
                              imageUrl: "",
                            }))
                          }
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-32 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center bg-slate-800/50">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-400">
                            Upload collection image
                          </p>
                        </div>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {/* Tags Selection */}
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    Tags ({publishData.tags.length} selected)
                  </Label>
                  <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={publishData.tags.includes(tag)}
                            onCheckedChange={() => toggleTag(tag)}
                            className="border-slate-500"
                          />
                          <Label
                            htmlFor={`tag-${tag}`}
                            className="text-sm text-slate-300 cursor-pointer"
                          >
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {publishData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {publishData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-purple-600/20 text-purple-300 border-purple-600/30"
                        >
                          {tag}
                          <Button
                            onClick={() => toggleTag(tag)}
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0 text-purple-300 hover:text-purple-100"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Difficulty & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">
                      Difficulty Level
                    </Label>
                    <Select
                      value={publishData.difficulty}
                      onValueChange={(value) =>
                        setPublishData((prev) => ({
                          ...prev,
                          difficulty: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">
                      Price (USD)
                    </Label>
                    <Select
                      value={publishData.price}
                      onValueChange={(value) =>
                        setPublishData((prev) => ({ ...prev, price: value }))
                      }
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="0">Free</SelectItem>
                        <SelectItem value="2.99">$2.99</SelectItem>
                        <SelectItem value="4.99">$4.99</SelectItem>
                        <SelectItem value="9.99">$9.99</SelectItem>
                        <SelectItem value="19.99">$19.99</SelectItem>
                        <SelectItem value="custom">Custom Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview Cards */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    Choose Preview Cards ({publishData.previewCards.length}{" "}
                    selected)
                  </Label>
                  <p className="text-xs text-slate-400 mb-3">
                    Select up to 5 cards to showcase your collection
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {mockFlashcards.map((card) => (
                      <div
                        key={card.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          publishData.previewCards.includes(card.id)
                            ? "border-purple-500 bg-purple-600/10"
                            : "border-slate-600 bg-slate-800/50 hover:bg-slate-700/50"
                        }`}
                        onClick={() => togglePreviewCard(card.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={publishData.previewCards.includes(card.id)}
                            disabled={
                              !publishData.previewCards.includes(card.id) &&
                              publishData.previewCards.length >= 5
                            }
                            className="mt-1 border-slate-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white mb-1 line-clamp-1">
                              {card.front}
                            </p>
                            <p className="text-xs text-slate-400 line-clamp-2">
                              {card.back}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Publishing Info */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-400" />
                Publishing Details
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Collection will be publicly searchable in marketplace</li>
                <li>
                  • Available for{" "}
                  {publishData.price === "0"
                    ? "free download"
                    : `purchase at $${publishData.price}`}
                </li>
                <li>• Attributed to your profile with download statistics</li>
                <li>• Preview cards will be shown to potential users</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setPublishDialogOpen(false);
                  setPublishData({
                    imageUrl: "",
                    tags: [],
                    difficulty: "beginner",
                    price: "0",
                    previewCards: [],
                  });
                }}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublishToMarketplace}
                disabled={
                  publishData.tags.length === 0 ||
                  publishData.previewCards.length === 0
                }
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                Publish to Marketplace
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
