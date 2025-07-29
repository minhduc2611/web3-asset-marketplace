/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix this file
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    ChevronDown,
    Download,
    Eye,
    Filter,
    Search,
    Star,
    Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { toast } from "sonner";

// Mock marketplace data
const mockMarketplaceCollections = [
  {
    id: "mp-1",
    name: "Advanced JavaScript Concepts",
    description: "Master complex JavaScript patterns, closures, prototypes, and ES6+ features with practical examples.",
    authorId: "user-1",
    authorName: "Sarah Chen",
    downloads: 1247,
    tags: ["javascript", "programming", "advanced"],
    difficulty: "advanced",
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
    cardCount: 45,
    rating: 4.8,
    isPublished: true,
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    id: "mp-2", 
    name: "Spanish Vocabulary Builder",
    description: "Essential Spanish words and phrases for beginners. Perfect for travel and daily conversations.",
    authorId: "user-2",
    authorName: "Miguel Rodriguez",
    downloads: 892,
    tags: ["spanish", "language", "vocabulary"],
    difficulty: "beginner",
    imageUrl: "https://images.unsplash.com/photo-1543159204-92b14cb3e2cc?w=400&h=200&fit=crop",
    cardCount: 120,
    rating: 4.6,
    isPublished: true,
    createdAt: "2024-12-08T14:30:00Z",
  },
  {
    id: "mp-3",
    name: "Biology Fundamentals",
    description: "Core biology concepts covering cell structure, genetics, evolution, and ecosystems.",
    authorId: "user-3", 
    authorName: "Dr. Emma Wilson",
    downloads: 567,
    tags: ["biology", "science", "education"],
    difficulty: "intermediate",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
    cardCount: 78,
    rating: 4.9,
    isPublished: true,
    createdAt: "2024-12-05T09:15:00Z",
  },
  {
    id: "mp-4",
    name: "Medical Terminology",
    description: "Essential medical terms, prefixes, suffixes, and root words for healthcare professionals.",
    authorId: "user-4",
    authorName: "Dr. James Park",
    downloads: 1456,
    tags: ["medical", "healthcare", "terminology"],
    difficulty: "advanced",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop",
    cardCount: 200,
    rating: 4.7,
    isPublished: true,
    createdAt: "2024-12-01T16:45:00Z",
  }
];

// Mock preview cards
const mockPreviewCards = {
  "mp-1": [
    { front: "What is a closure in JavaScript?", back: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned." },
    { front: "Explain the concept of hoisting", back: "Hoisting is JavaScript's default behavior of moving declarations to the top of their scope during compilation." },
    { front: "What is the difference between let, const, and var?", back: "var is function-scoped, let and const are block-scoped. const cannot be reassigned." }
  ],
  "mp-2": [
    { front: "Hello", back: "Hola" },
    { front: "Thank you", back: "Gracias" },
    { front: "How are you?", back: "¿Cómo estás?" }
  ],
  "mp-3": [
    { front: "What is the powerhouse of the cell?", back: "Mitochondria - they produce ATP through cellular respiration." },
    { front: "What is DNA?", back: "Deoxyribonucleic acid - the hereditary material that contains genetic instructions." }
  ],
  "mp-4": [
    { front: "What does the prefix 'cardio-' mean?", back: "Heart - relating to the heart and cardiovascular system." },
    { front: "Define 'tachycardia'", back: "A rapid heart rate, typically over 100 beats per minute in adults." }
  ]
};

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previewCollection, setPreviewCollection] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const queryClient = useQueryClient();

  // Filter collections based on search and filters
  const filteredCollections = mockMarketplaceCollections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === "all" || collection.difficulty === selectedDifficulty;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => collection.tags.includes(tag));
    
    return matchesSearch && matchesDifficulty && matchesTags;
  });

  // Get all available tags
  const allTags = Array.from(new Set(mockMarketplaceCollections.flatMap(c => c.tags)));

  const handleDownload = async (collectionId: string) => {
    try {
      await apiRequest("POST", `/api/collections/${collectionId}/download`);
      toast.success("Collection Downloaded", {
        description: "The collection has been added to your library.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    } catch {
      toast.error("Download Failed", {
        description: "Failed to download collection. Please try again.",
      });
    }
  };

  const handlePreview = (collection: any) => {
    setPreviewCollection(collection);
    setIsPreviewOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "intermediate": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "advanced": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/collections">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Collections
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Marketplace
              </h1>
              <p className="text-slate-400 mt-2">Discover and download collections shared by the community</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search collections, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            
            {/* Difficulty Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedDifficulty === "all" ? "All Levels" : selectedDifficulty}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-600">
                <DropdownMenuItem onClick={() => setSelectedDifficulty("all")} className="text-slate-300">
                  All Levels
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDifficulty("beginner")} className="text-slate-300">
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDifficulty("intermediate")} className="text-slate-300">
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDifficulty("advanced")} className="text-slate-300">
                  Advanced
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  selectedTags.includes(tag) 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/50 transition-colors h-full">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div 
                      className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 bg-cover bg-center rounded-t-lg"
                      style={collection.imageUrl ? { backgroundImage: `url(${collection.imageUrl})` } : {}}
                    />
                    
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white text-lg line-clamp-1">
                          {collection.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{collection.rating}</span>
                        </div>
                      </div>

                      {/* Author & Stats */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {collection.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {collection.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {collection.cardCount}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                        {collection.description}
                      </p>

                      {/* Tags & Difficulty */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-wrap gap-1">
                          {collection.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {collection.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{collection.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Badge className={getDifficultyColor(collection.difficulty)}>
                          {collection.difficulty}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePreview(collection)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-600 hover:bg-slate-600"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleDownload(collection.id)}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No collections found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl sm:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {previewCollection?.name}
            </DialogTitle>
          </DialogHeader>
          
          {previewCollection && (
            <div className="space-y-6">
              {/* Collection Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>By {previewCollection.authorName}</span>
                  <span>{previewCollection.cardCount} cards</span>
                  <Badge className={getDifficultyColor(previewCollection.difficulty)}>
                    {previewCollection.difficulty}
                  </Badge>
                </div>
                <p className="text-slate-300">{previewCollection.description}</p>
                <div className="flex flex-wrap gap-2">
                  {previewCollection.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Sample Cards */}
              <div>
                <h4 className="font-semibold mb-3">Sample Cards</h4>
                <div className="space-y-3">
                  {(mockPreviewCards as any)[previewCollection.id]?.map((card: any, index: number) => (
                    <Card key={index} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div>
                            <h5 className="font-medium text-purple-300 text-sm">Front:</h5>
                            <MarkdownRenderer 
                              content={card.front}
                              theme="dark"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-300 text-sm">Back:</h5>
                            <MarkdownRenderer 
                              content={card.back}
                              theme="dark"
                              className="text-sm text-slate-300"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={() => {
                  handleDownload(previewCollection.id);
                  setIsPreviewOpen(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Collection
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}