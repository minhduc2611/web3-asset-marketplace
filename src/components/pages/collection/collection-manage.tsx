/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix this file
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import FlashcardModal from "@/components/pages/collection/flashcard-modal";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Brain,
  Star,
  Volume2,
  Image,
  Video,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Copy,
  Wand2,
  BookOpen,
  Sparkles,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Helper functions for bulk card editing
// const getEditingData = (
//   cardId: string,
//   editingData: { [key: string]: { front: string; back: string } },
//   defaultFront: string,
//   defaultBack: string
// ) => {
//   return editingData[cardId] || { front: defaultFront, back: defaultBack };
// };

const updateEditingData = (
  cardId: string,
  editingData: any,
  setEditingData: any,
  front: string,
  back: string
) => {
  setEditingData((prev: any) => ({
    ...prev,
    [cardId]: { front, back },
  }));
};

// Same mock data as collection detail
const mockFlashcards = [
  {
    id: "1",
    front:
      "🚀 **What is React?**\n\nExplain React and its key benefits for web development.",
    back: "## React Overview\n\n**React** is a JavaScript library for building user interfaces, particularly web applications.\n\n### Key Benefits:\n\n1. **🔄 Component-Based**: Reusable UI components\n2. **⚡ Virtual DOM**: Fast rendering and updates\n3. **🔀 Declarative**: Easier to understand and debug\n4. **🌐 Large Ecosystem**: Extensive community and tools\n\n### Example:\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n```\n\n*React makes it painless to create interactive UIs!*",
    frontMedia: "",
    backMedia:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 1,
    reviewCount: 3,
  },
  {
    id: "2",
    front:
      "🎯 **CSS Flexbox**\n\nWhat does `justify-content: space-between` do in a flex container?",
    back: "## justify-content: space-between\n\nThis property **distributes flex items evenly** with:\n\n- **First item** is on the start line\n- **Last item** is on the end line\n- **Equal space** between items\n\n### Visual Example:\n```\n[Item1]    [Item2]    [Item3]\n```\n\n### Code:\n```css\n.container {\n  display: flex;\n  justify-content: space-between;\n}\n```\n\n💡 **Perfect for navigation bars and button groups!**",
    frontMedia: "",
    backMedia: "",
    audioUrl: "",
    difficulty: 0,
    reviewCount: 5,
  },
  {
    id: "3",
    front:
      "🔐 **Authentication vs Authorization**\n\nWhat's the difference between these two security concepts?",
    back: '## Security Concepts\n\n### 🔑 Authentication\n**"Who are you?"**\n- Verifies user identity\n- Login with username/password\n- Biometric verification\n- Multi-factor authentication\n\n### 🛡️ Authorization  \n**"What can you do?"**\n- Determines user permissions\n- Role-based access control\n- Resource-level permissions\n- API endpoint restrictions\n\n### Memory Trick:\n- **AuthN** = Authentication = **N**ame verification\n- **AuthZ** = Authorization = **Z**one permissions\n\n🔒 *Both are essential for secure applications!*',
    frontMedia: "",
    backMedia:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 1,
    reviewCount: 2,
  },
  {
    id: "4",
    front:
      "🌟 **Big O Notation**\n\nWhat is the time complexity of binary search and why?",
    back: "## Binary Search: O(log n)\n\n### How it works:\n1. **Divide** the sorted array in half\n2. **Compare** target with middle element\n3. **Eliminate** half of the remaining elements\n4. **Repeat** until found or exhausted\n\n### Why O(log n)?\n- Each step **halves** the search space\n- For n elements: log₂(n) maximum steps\n- Example: 1000 elements = ~10 steps max\n\n### Code Example:\n```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n```\n\n⚡ **Much faster than linear search O(n)!**",
    frontMedia: "",
    backMedia:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 1,
    reviewCount: 2,
  },
  {
    id: "5",
    front:
      "🔮 **Promises in JavaScript**\n\nWhat is a Promise and what are its three states?",
    back: "## JavaScript Promises\n\nA **Promise** represents the eventual completion or failure of an asynchronous operation.\n\n### Three States:\n\n1. **🟡 Pending**: Initial state, neither fulfilled nor rejected\n2. **🟢 Fulfilled**: Operation completed successfully\n3. **🔴 Rejected**: Operation failed\n\n### Example:\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  // Async operation here\n  if (success) resolve(value);\n  else reject(error);\n});\n```",
    frontMedia: "",
    backMedia:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 0,
    reviewCount: 1,
  },
  {
    id: "6",
    front:
      '🌍 **Geographic Memory Palace**\n\nWhich **European capital** is known as the "Pearl of the Danube"?\n\n*Hint: Famous for its thermal baths and parliament building*',
    back: '## Budapest, Hungary 🇭🇺\n\n**Why "Pearl of the Danube"?**\n- The Danube River divides the city into **Buda** (hills) and **Pest** (plains)\n- Stunning architecture reflecting on the water\n- UNESCO World Heritage riverbank\n\n### Memory Techniques:\n- **Buda + Pest = Budapest**\n- **Pearl** = Beautiful architecture by the river\n- **Thermal baths** = Roman legacy still active today\n\n🏛️ *The Parliament building is one of the largest in the world*',
    frontMedia: "",
    backMedia:
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 1,
    reviewCount: 0,
  },
];

const mockCollection = {
  id: "1",
  name: "JavaScript Fundamentals",
  description: "Core concepts of JavaScript programming language",
  cardCount: mockFlashcards.length,
};

export default function ManageFlashcards({
  collectionId,
}: {
  collectionId: string;
}) {
  const [flashcards, setFlashcards] = useState(mockFlashcards);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [previewCard, setPreviewCard] = useState<any>(null);
  const [editCard, setEditCard] = useState<any>(null);
  const [bulkType, setBulkType] = useState<
    "text" | "prompt" | "topics" | "upload"
  >("text");
  const [bulkContent, setBulkContent] = useState("");
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkCards, setBulkCards] = useState<any[]>([]);
  const [selectedBulkCards, setSelectedBulkCards] = useState<Set<string>>(
    new Set()
  );
  const [editingBulkCard, setEditingBulkCard] = useState<string | null>(null);
  const [editingCardData, setEditingCardData] = useState<{
    [key: string]: { front: string; back: string };
  }>({});
  const [isGenerating, setIsGenerating] = useState(false);

  if (!collectionId) {
    return <div>Collection not found</div>;
  }

  const filteredCards = flashcards.filter((card) => {
    const matchesSearch =
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" ||
      card.difficulty.toString() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleSelectAll = () => {
    if (selectedCards.size === filteredCards.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(filteredCards.map((card) => card.id)));
    }
  };

  const handleSelectCard = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedCards.size === 0) return;

    setFlashcards((prev) => prev.filter((card) => !selectedCards.has(card.id)));
    setSelectedCards(new Set());

    toast.success("Cards Deleted", {
      description: `Successfully deleted ${selectedCards.size} flashcard(s).`,
    });
  };

  const handlePreview = (card: any) => {
    setPreviewCard(card);
    setShowPreviewModal(true);
  };

  const handleEdit = (card: any) => {
    setEditCard(card);
    setShowEditModal(true);
  };

  const handleSaveFlashcard = (flashcardData: any) => {
    if (showEditModal) {
      setFlashcards((prev) =>
        prev.map((card) =>
          card.id === flashcardData.id ? flashcardData : card
        )
      );
      toast.success("Card Updated", {
        description: "Flashcard has been successfully updated.",
      });
    } else {
      setFlashcards((prev) => [
        ...prev,
        { ...flashcardData, id: Date.now().toString() },
      ]);
      toast.success("Card Created", {
        description: "New flashcard has been added to the collection.",
      });
    }
  };

  const handleBulkGenerate = async () => {
    if (!bulkContent.trim()) {
      toast.error("Content Required", {
        description: "Please provide content for bulk generation.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      let prompt = "";

      switch (bulkType) {
        case "text":
          prompt = `Create ${bulkCount} flashcards from this content: "${bulkContent}". Extract key concepts and create question-answer pairs in markdown format.`;
          break;
        case "prompt":
          prompt = `Create ${bulkCount} flashcards about: "${bulkContent}". Make educational question-answer pairs with detailed explanations in markdown format.`;
          break;
        case "topics":
          prompt = `Create ${bulkCount} flashcards covering these topics: "${bulkContent}". Create comprehensive study materials with examples in markdown format.`;
          break;
        case "upload":
          prompt = `Create ${bulkCount} flashcards from this document content: "${bulkContent}". Focus on the most important concepts and make them memorable.`;
          break;
      }

      const response = await fetch("/api/generate-bulk-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, count: bulkCount }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      const generatedCards = data.flashcards.map(
        (card: { front: string; back: string }, index: number) => ({
          id: `bulk-${Date.now()}-${index}`,
          front: card.front,
          back: card.back,
          frontMedia: "",
          backMedia: "",
          audioUrl: "",
          difficulty: Math.floor(Math.random() * 3),
          reviewCount: 0,
        })
      );

      setBulkCards(generatedCards);
      setSelectedBulkCards(
        new Set(generatedCards.map((card: { id: string }) => card.id))
      );
      setShowBulkModal(false);
      setShowBulkPreview(true);
    } catch {
      toast.error("Generation Failed", {
        description: "Failed to generate flashcards. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmBulk = () => {
    const selectedCards = bulkCards.filter((card) =>
      selectedBulkCards.has(card.id)
    );
    setFlashcards((prev) => [...prev, ...selectedCards]);

    toast.success("Cards Added", {
      description: `Successfully added ${selectedCards.length} flashcard(s) to your collection.`,
    });

    setShowBulkPreview(false);
    setBulkCards([]);
    setSelectedBulkCards(new Set());
    setBulkContent("");
  };

  const handleSelectBulkCard = (cardId: string) => {
    const newSelected = new Set(selectedBulkCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedBulkCards(newSelected);
  };

  const handleSelectAllBulk = () => {
    if (selectedBulkCards.size === bulkCards.length) {
      setSelectedBulkCards(new Set());
    } else {
      setSelectedBulkCards(new Set(bulkCards.map((card) => card.id)));
    }
  };

  const handleEditBulkCard = (cardId: string) => {
    setEditingBulkCard(cardId);
    const card = bulkCards.find((c) => c.id === cardId);
    if (card) {
      setEditingCardData((prev) => ({
        ...prev,
        [cardId]: { front: card.front, back: card.back },
      }));
    }
  };

  const handleSaveBulkCard = (cardId: string) => {
    const editData = editingCardData[cardId];
    if (editData) {
      setBulkCards((prev) =>
        prev.map((card) =>
          card.id === cardId
            ? { ...card, front: editData.front, back: editData.back }
            : card
        )
      );
      setEditingBulkCard(null);

      toast.success("Card Updated", {
        description: "Changes saved successfully.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBulkCard(null);
  };

  const getDifficultyConfig = (difficulty: number) => {
    switch (difficulty) {
      case 0:
        return {
          label: "Easy",
          color: "bg-green-600/20 text-green-300 border-green-600/30",
        };
      case 1:
        return {
          label: "Medium",
          color: "bg-yellow-600/20 text-yellow-300 border-yellow-600/30",
        };
      case 2:
        return {
          label: "Hard",
          color: "bg-red-600/20 text-red-300 border-red-600/30",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-600/20 text-gray-300 border-gray-600/30",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-4 py-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href={`/collections/${collectionId}`}>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Study
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Manage Flashcards
                  </h1>
                  <p className="text-sm text-slate-400">
                    {mockCollection.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="outline"
                className="border-slate-600  hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Card
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Add Bulk
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800 border-slate-700 w-64"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setBulkType("text");
                      setShowBulkModal(true);
                    }}
                    className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer p-3"
                  >
                    <Copy className="w-4 h-4 mr-3 text-blue-400" />
                    <div>
                      <div className="font-medium">Copy & Paste Text</div>
                      <div className="text-xs text-slate-400">
                        Paste content and AI will create flashcards
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setBulkType("prompt");
                      setShowBulkModal(true);
                    }}
                    className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer p-3"
                  >
                    <Wand2 className="w-4 h-4 mr-3 text-purple-400" />
                    <div>
                      <div className="font-medium">AI Prompt</div>
                      <div className="text-xs text-slate-400">
                        Describe what you want to study
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setBulkType("topics");
                      setShowBulkModal(true);
                    }}
                    className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer p-3"
                  >
                    <BookOpen className="w-4 h-4 mr-3 text-green-400" />
                    <div>
                      <div className="font-medium">Topic List</div>
                      <div className="text-xs text-slate-400">
                        List topics to create comprehensive cards
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setBulkType("upload");
                      setShowBulkModal(true);
                    }}
                    className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer p-3"
                  >
                    <Upload className="w-4 h-4 mr-3 text-orange-400" />
                    <div>
                      <div className="font-medium">Document Content</div>
                      <div className="text-xs text-slate-400">
                        Extract key concepts from documents
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search flashcards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white pl-10"
              />
            </div>

            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="0">Easy</SelectItem>
                <SelectItem value="1">Medium</SelectItem>
                <SelectItem value="2">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Bulk Actions */}
        {filteredCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedCards.size === filteredCards.length}
                  onCheckedChange={handleSelectAll}
                  className="border-slate-600"
                />
                <span className="text-slate-300">
                  {selectedCards.size > 0
                    ? `${selectedCards.size} card(s) selected`
                    : "Select all cards"}
                </span>
              </div>

              {selectedCards.size > 0 && (
                <Button
                  onClick={handleBulkDelete}
                  variant="outline"
                  className="border-red-600/50 text-red-400 hover:bg-red-600/20 hover:border-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedCards.size})
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCards.map((card, index) => {
              const difficultyConfig = getDifficultyConfig(card.difficulty);

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300">
                    <CardContent className="p-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <Checkbox
                          checked={selectedCards.has(card.id)}
                          onCheckedChange={() => handleSelectCard(card.id)}
                          className="border-slate-600 mt-1"
                        />
                        <div className="flex items-center gap-2">
                          {card.audioUrl && (
                            <Volume2 className="w-4 h-4 text-blue-400" />
                          )}
                          {(card.frontMedia || card.backMedia) &&
                            (card.frontMedia?.includes("mp4") ||
                            card.backMedia?.includes("mp4") ? (
                              <Video className="w-4 h-4 text-purple-400" />
                            ) : (
                              // eslint-disable-next-line jsx-a11y/alt-text
                              <Image className="w-4 h-4 text-green-400" />
                            ))}
                        </div>
                      </div>

                      {/* Card Content Preview */}
                      <div className="space-y-3">
                        <MarkdownRenderer 
                          content={card.front.length > 100
                            ? card.front.substring(0, 100) + "..."
                            : card.front}
                          theme="dark"
                          className="prose-sm"
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={difficultyConfig.color}
                            >
                              {difficultyConfig.label}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {card.reviewCount}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700">
                        <Button
                          onClick={() => handlePreview(card)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-600 hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleEdit(card)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-600 hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <AlertTriangle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No flashcards found
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || difficultyFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first flashcard"}
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Card
            </Button>
          </motion.div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl sm:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Flashcard Preview
            </DialogTitle>
          </DialogHeader>

          {previewCard && (
            <div className="space-y-6 py-4">
              {/* Front Side */}
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  Front Side
                </h3>
                <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                  <MarkdownRenderer 
                    content={previewCard.front}
                    theme="dark"
                  />
                </div>
              </div>

              {/* Back Side */}
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  Back Side
                </h3>
                <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                  <MarkdownRenderer 
                    content={previewCard.back}
                    theme="dark"
                  />
                </div>
              </div>

              {/* Media */}
              {(previewCard.frontMedia || previewCard.backMedia) && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">
                    Media
                  </h3>
                  {previewCard.backMedia && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewCard.backMedia}
                      alt="Card media"
                      className="w-full max-h-48 object-cover rounded-lg border border-slate-600"
                    />
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <Badge
                  variant="secondary"
                  className={getDifficultyConfig(previewCard.difficulty).color}
                >
                  {getDifficultyConfig(previewCard.difficulty).label}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                >
                  <Star className="w-3 h-3 mr-1" />
                  {previewCard.reviewCount} reviews
                </Badge>
                {previewCard.audioUrl && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-600/20 text-purple-300 border-purple-600/30"
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    Audio
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <FlashcardModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveFlashcard}
        flashcard={editCard}
        mode="edit"
      />

      {/* Create Modal */}
      <FlashcardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveFlashcard}
        mode="create"
      />

      {/* Bulk Creation Modal */}
      <Dialog open={showBulkModal} onOpenChange={setShowBulkModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {bulkType === "text" && "Create from Text"}
              {bulkType === "prompt" && "Create from AI Prompt"}
              {bulkType === "topics" && "Create from Topics"}
              {bulkType === "upload" && "Create from Document"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Bulk Count */}
            <div className="flex items-center gap-4">
              <Label htmlFor="bulk-count" className="text-slate-300 min-w-fit">
                Number of cards:
              </Label>
              <Input
                id="bulk-count"
                type="number"
                value={bulkCount}
                onChange={(e) => setBulkCount(parseInt(e.target.value) || 5)}
                className="bg-slate-700 border-slate-600 text-white w-20"
                min="1"
                max="20"
              />
              <span className="text-slate-400 text-sm">Max 20</span>
            </div>

            {/* Content Input */}
            <div className="space-y-2">
              <Label htmlFor="bulk-content" className="text-slate-300">
                {bulkType === "text" && "Paste your content here:"}
                {bulkType === "prompt" && "Describe what you want to study:"}
                {bulkType === "topics" &&
                  "List topics (one per line or comma-separated):"}
                {bulkType === "upload" && "Paste document content:"}
              </Label>
              <Textarea
                id="bulk-content"
                value={bulkContent}
                onChange={(e) => setBulkContent(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[200px] resize-none"
                placeholder={
                  bulkType === "text"
                    ? "Paste your study material, notes, or any text content..."
                    : bulkType === "prompt"
                    ? 'Example: "JavaScript array methods with examples and use cases"'
                    : bulkType === "topics"
                    ? "Example: React hooks, useState, useEffect, useContext, custom hooks"
                    : "Paste content from PDFs, articles, or documents..."
                }
              />
              <p className="text-xs text-slate-400">
                {bulkType === "text" &&
                  "AI will extract key concepts and create question-answer pairs"}
                {bulkType === "prompt" &&
                  "AI will create comprehensive study materials on this topic"}
                {bulkType === "topics" &&
                  "AI will create detailed flashcards covering each topic"}
                {bulkType === "upload" &&
                  "AI will identify the most important concepts for study"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => setShowBulkModal(false)}
              className="border-slate-600 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkGenerate}
              disabled={isGenerating || !bulkContent.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate {bulkCount} Cards
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Preview Modal */}
      <Dialog open={showBulkPreview} onOpenChange={setShowBulkPreview}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Preview Generated Cards
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4 overflow-hidden flex flex-col">
            {/* Selection Controls */}
            <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={
                    selectedBulkCards.size === bulkCards.length &&
                    bulkCards.length > 0
                  }
                  onCheckedChange={handleSelectAllBulk}
                  className="border-slate-600"
                />
                <span className="text-slate-300">
                  {selectedBulkCards.size > 0
                    ? `${selectedBulkCards.size} of ${bulkCards.length} selected`
                    : "Select all cards"}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-600/20 text-purple-300 border-purple-600/30"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2">
              <AnimatePresence>
                {bulkCards.map((card, index) => {
                  const difficultyConfig = getDifficultyConfig(card.difficulty);
                  const isEditing = editingBulkCard === card.id;
                  const editData = editingCardData[card.id] || {
                    front: card.front,
                    back: card.back,
                  };

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="bg-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-3">
                            <Checkbox
                              checked={selectedBulkCards.has(card.id)}
                              onCheckedChange={() =>
                                handleSelectBulkCard(card.id)
                              }
                              className="border-slate-600 mt-1"
                            />
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={difficultyConfig.color}
                              >
                                {difficultyConfig.label}
                              </Badge>
                              {!isEditing && (
                                <Button
                                  onClick={() => handleEditBulkCard(card.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-400 hover:text-white hover:bg-slate-600 p-1"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-3">
                            {/* Front Content */}
                            <div>
                              <h4 className="text-sm font-semibold text-purple-300 mb-2">
                                Front:
                              </h4>
                              {isEditing ? (
                                <Textarea
                                  value={editData.front}
                                  onChange={(e) =>
                                    updateEditingData(
                                      card.id,
                                      editingCardData,
                                      setEditingCardData,
                                      e.target.value,
                                      editData.back
                                    )
                                  }
                                  className="bg-slate-600 border-slate-500 text-white text-sm min-h-[80px] resize-none"
                                  placeholder="Front content..."
                                />
                              ) : (
                                <MarkdownRenderer 
                                  content={card.front.length > 150
                                    ? card.front.substring(0, 150) + "..."
                                    : card.front}
                                  theme="dark"
                                  className="prose-sm"
                                />
                              )}
                            </div>

                            {/* Back Content */}
                            <div>
                              <h4 className="text-sm font-semibold text-blue-300 mb-2">
                                Back:
                              </h4>
                              {isEditing ? (
                                <Textarea
                                  value={editData.back}
                                  onChange={(e) =>
                                    updateEditingData(
                                      card.id,
                                      editingCardData,
                                      setEditingCardData,
                                      editData.front,
                                      e.target.value
                                    )
                                  }
                                  className="bg-slate-600 border-slate-500 text-white text-sm min-h-[100px] resize-none"
                                  placeholder="Back content..."
                                />
                              ) : (
                                <MarkdownRenderer 
                                  content={card.back.length > 200
                                    ? card.back.substring(0, 200) + "..."
                                    : card.back}
                                  theme="dark"
                                  className="prose-sm"
                                />
                              )}
                            </div>
                          </div>

                          {/* Edit Actions */}
                          {isEditing && (
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-600">
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-slate-600 hover:bg-slate-600"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleSaveBulkCard(card.id)}
                                size="sm"
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                              >
                                Save
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkPreview(false);
                setBulkCards([]);
                setSelectedBulkCards(new Set());
              }}
              className="border-slate-600 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBulk}
              disabled={selectedBulkCards.size === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Add {selectedBulkCards.size} Card
              {selectedBulkCards.size !== 1 ? "s" : ""} to Collection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
