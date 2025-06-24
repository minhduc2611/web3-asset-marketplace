/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix this file
"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FlashcardModal from "@/components/pages/collection/flashcard-modal";
import ReactMarkdown from "react-markdown";
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Brain,
  Target,
  Clock,
  Zap,
  BookOpen,
  Star,
  Edit,
  Plus,
  Volume2,
  Pause,
  Image,
  Video,
  MoreVertical,
  Settings,
  List
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Enhanced mock flashcard data with markdown, media, and audio
const mockFlashcards = [
  {
    id: "0",
    front: "# Audio Test Card 🎵\n\nThis card has **audio pronunciation**!\n\nClick the speaker icon to hear the sound.",
    back: "## Great! 🔊\n\nYou can hear the audio playing.\n\n**Features:**\n- 🎵 Audio playback\n- 🖼️ Image support\n- 📝 Markdown formatting\n- 📱 Mobile-friendly",
    frontMedia: "",
    backMedia: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    difficulty: 0,
    reviewCount: 0
  },
  {
    id: "1",
    front: "# What is a closure in JavaScript?\n\nConsider this example:\n```javascript\nfunction outer() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n```",
    back: "## Answer: Closure\n\nA **closure** is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.\n\n### Key Points:\n- Gives access to outer function's scope\n- Persists even after outer function returns\n- Commonly used for data privacy\n- Essential for functional programming patterns",
    frontMedia: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop",
    backMedia: "",
    audioUrl: "",
    difficulty: 1,
    reviewCount: 3
  },
  {
    id: "2", 
    front: "## Variable Declarations\n\nWhat are the differences between `let`, `const`, and `var`?\n\n*Think about scope, hoisting, and reassignment*",
    back: "### Comparison Table\n\n| Feature | var | let | const |\n|---------|-----|-----|-------|\n| Scope | Function | Block | Block |\n| Hoisting | Yes | Yes (TDZ) | Yes (TDZ) |\n| Reassignment | ✅ | ✅ | ❌ |\n| Redeclaration | ✅ | ❌ | ❌ |\n\n**TDZ** = Temporal Dead Zone",
    frontMedia: "",
    backMedia: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 2,
    reviewCount: 1
  },
  {
    id: "3",
    front: "🌊 **Event Bubbling**\n\nWhat happens when you click a button inside a div?\n\n```html\n<div onclick=\"divClick()\">\n  <button onclick=\"buttonClick()\">Click me</button>\n</div>\n```",
    back: "## Event Bubbling Process\n\n1. **Target Phase**: Event starts at the clicked element\n2. **Bubbling Phase**: Event bubbles up through parent elements\n3. **Document**: Finally reaches the document root\n\n### Execution Order:\n1. `buttonClick()` fires first\n2. `divClick()` fires second\n\n💡 Use `event.stopPropagation()` to prevent bubbling",
    frontMedia: "",
    backMedia: "",
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
    difficulty: 0,
    reviewCount: 0
  },
  {
    id: "4",
    front: "⚡ **Equality Operators**\n\nWhat's the difference between `==` and `===`?\n\n```javascript\n5 == '5'   // ?\n5 === '5'  // ?\n```",
    back: "## Equality Comparison\n\n### `==` (Loose Equality)\n- Performs **type coercion**\n- Converts operands to same type before comparison\n- `5 == '5'` → `true`\n\n### `===` (Strict Equality)\n- **No type conversion**\n- Compares both value and type\n- `5 === '5'` → `false`\n\n✅ **Best Practice**: Always use `===` unless you specifically need type coercion",
    frontMedia: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=300&fit=crop",
    backMedia: "",
    audioUrl: "",
    difficulty: 1,
    reviewCount: 2
  },
  {
    id: "5",
    front: "🔮 **Promises in JavaScript**\n\nWhat is a Promise and what are its three states?",
    back: "## JavaScript Promises\n\nA **Promise** represents the eventual completion or failure of an asynchronous operation.\n\n### Three States:\n\n1. **🟡 Pending**: Initial state, neither fulfilled nor rejected\n2. **🟢 Fulfilled**: Operation completed successfully\n3. **🔴 Rejected**: Operation failed\n\n### Example:\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  // Async operation here\n  if (success) resolve(value);\n  else reject(error);\n});\n```",
    frontMedia: "",
    backMedia: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 0,
    reviewCount: 1
  },
  {
    id: "6",
    front: "🌍 **Geographic Memory Palace**\n\nWhich **European capital** is known as the \"Pearl of the Danube\"?\n\n*Hint: Famous for its thermal baths and parliament building*",
    back: "## Budapest, Hungary 🇭🇺\n\n**Why \"Pearl of the Danube\"?**\n- The Danube River divides the city into **Buda** (hills) and **Pest** (plains)\n- Stunning architecture reflecting on the water\n- UNESCO World Heritage riverbank\n\n### Memory Techniques:\n- **Buda + Pest = Budapest**\n- **Pearl** = Beautiful architecture by the river\n- **Thermal baths** = Roman legacy still active today\n\n🏛️ *The Parliament building is one of the largest in the world*",
    frontMedia: "",
    backMedia: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 1,
    reviewCount: 0
  },
  {
    id: "7",
    front: "🧬 **Biology: Cellular Respiration**\n\nWhat is the overall equation for **cellular respiration**?\n\n```\nGlucose + ? → ? + ? + Energy\n```\n\n*Fill in the blanks and explain the process*",
    back: "## Cellular Respiration Equation\n\n```\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP\n(Glucose + Oxygen → Carbon Dioxide + Water + Energy)\n```\n\n### Three Main Stages:\n\n1. **Glycolysis** (Cytoplasm)\n   - Glucose → Pyruvate\n   - Produces 2 ATP\n\n2. **Krebs Cycle** (Mitochondria)\n   - Pyruvate → CO₂\n   - Produces electron carriers\n\n3. **Electron Transport Chain** (Inner mitochondrial membrane)\n   - Most ATP production (~34 ATP)\n\n💡 **Memory Trick**: *\"Glucose Eats Oxygen, Spits Carbon and Water, Makes Energy\"*",
    frontMedia: "",
    backMedia: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 2,
    reviewCount: 1
  },
  {
    id: "8",
    front: "🎼 **Music Theory**\n\nWhat are the **notes** in a **C Major scale**?\n\n*Include both the note names and the pattern of whole/half steps*",
    back: "## C Major Scale 🎹\n\n### Notes:\n**C - D - E - F - G - A - B - C**\n\n### Step Pattern:\n```\nC → D → E → F → G → A → B → C\n W   W   H   W   W   W   H\n```\n\n**W** = Whole step (2 semitones)\n**H** = Half step (1 semitone)\n\n### Memory Devices:\n- **\"All Cows Eat Grass\"** (String names: E-A-D-G)\n- **\"Every Good Boy Does Fine\"** (Treble clef lines: E-G-B-D-F)\n- **No sharps or flats** - easiest to remember!\n\n🎵 *This pattern (W-W-H-W-W-W-H) applies to ALL major scales*",
    frontMedia: "",
    backMedia: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav",
    difficulty: 1,
    reviewCount: 2
  },
  {
    id: "9",
    front: "📚 **Literature: Shakespearean Sonnets**\n\nWhat is the **rhyme scheme** of a Shakespearean (English) sonnet?\n\n*Bonus: How many lines and what's the structure?*",
    back: "## Shakespearean Sonnet Structure 📜\n\n### Rhyme Scheme:\n**ABAB CDCD EFEF GG**\n\n### Structure:\n- **14 lines total**\n- **3 quatrains** (4-line stanzas) + **1 couplet** (2 lines)\n- **Iambic pentameter** (10 syllables per line)\n\n### Content Pattern:\n1. **Quatrain 1** (Lines 1-4): Introduce the theme\n2. **Quatrain 2** (Lines 5-8): Develop/complicate the theme  \n3. **Quatrain 3** (Lines 9-12): Twist or turn (\"volta\")\n4. **Couplet** (Lines 13-14): Resolution or conclusion\n\n### Famous Example:\n*\"Shall I compare thee to a summer's day?\"* (Sonnet 18)\n\n💡 **Memory**: *3 questions + 1 answer = Shakespearean sonnet*",
    frontMedia: "",
    backMedia: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop",
    audioUrl: "",
    difficulty: 2,
    reviewCount: 0
  }
];

const mockCollection = {
  id: "1",
  name: "JavaScript Fundamentals",
  description: "Core concepts of JavaScript programming language",
  cardCount: mockFlashcards.length
};

export default function CollectionDetailEnhanced({ collectionId }: { collectionId: string }) {
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState(new Set<string>());
  const [showResults, setShowResults] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [flashcards, setFlashcards] = useState(mockFlashcards);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Settings state
  const [settings, setSettings] = useState({
    dailyPracticeLimit: 20,
    showProgress: true,
    autoPlayAudio: false,
    difficultyReminder: true,
    studyReminders: true,
    darkMode: true
  });

  if (!collectionId) {
    return <div>Collection not found</div>;
  }

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;

  const handleDifficultySelect = (difficulty: 'super_easy' | 'easy' | 'medium' | 'hard') => {
    console.log("Difficulty selected:", difficulty);
    const newSet = new Set(completedCards);
    newSet.add(currentCard.id);
    setCompletedCards(newSet);
    
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
      setIsPlaying(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCompletedCards(new Set());
    setShowResults(false);
    setIsPlaying(false);
  };

  const handleSaveFlashcard = (flashcardData: any) => {
    if (showEditModal) {
      setFlashcards(prev => 
        prev.map(card => card.id === flashcardData.id ? flashcardData : card)
      );
    } else {
      setFlashcards(prev => [...prev, flashcardData]);
    }
  };

  const toggleAudio = () => {
    if (!currentCard.audioUrl || !audioRef.current) {
      console.log("No audio URL or audio ref:", { audioUrl: currentCard.audioUrl, audioRef: audioRef.current });
      return;
    }
    
    console.log("Toggling audio:", currentCard.audioUrl, "Currently playing:", isPlaying);
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio play failed:", error);
        toast.error("Audio Error", {
          description: "Failed to play audio. Please check the audio URL.",
        });
      });
      setIsPlaying(true);
    }
  };

  const getDifficultyConfig = (type: string) => {
    switch (type) {
      case 'super_easy':
        return { 
          label: 'Super Easy', 
          color: 'bg-green-600 hover:bg-green-700 text-white',
          icon: CheckCircle,
          description: 'I knew it instantly'
        };
      case 'easy':
        return { 
          label: 'Easy', 
          color: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: Star,
          description: 'I got it with little effort'
        };
      case 'medium':
        return { 
          label: 'Medium', 
          color: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icon: Brain,
          description: 'I had to think about it'
        };
      case 'hard':
        return { 
          label: 'Hard', 
          color: 'bg-red-600 hover:bg-red-700 text-white',
          icon: XCircle,
          description: 'I struggled or got it wrong'
        };
      default:
        return { label: '', color: '', icon: CheckCircle, description: '' };
    }
  };

  const getMediaElement = (mediaUrl: string) => {
    if (!mediaUrl || mediaUrl.trim() === "") return null;
    
    console.log("Rendering media:", mediaUrl); // Debug log
    
    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl) || mediaUrl.includes('unsplash.com');
    
    if (isVideo) {
      return (
        <div className="relative mt-4 border border-slate-600 rounded-lg overflow-hidden">
          <video 
            src={mediaUrl} 
            controls 
            className="w-full max-h-48 bg-slate-800"
            preload="metadata"
            onError={() => console.error("Video failed to load:", mediaUrl)}
          />
          <div className="absolute top-2 left-2 p-1 bg-black/70 rounded-md">
            <Video className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    } else if (isImage) {
      return (
        <div className="relative mt-4 border border-slate-600 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={mediaUrl} 
            alt="Card media" 
            className="w-full max-h-48 object-cover bg-slate-800"
            onError={(e) => {
              console.error("Image failed to load:", mediaUrl);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log("Image loaded successfully:", mediaUrl)}
          />
          <div className="absolute top-2 left-2 p-1 bg-black/70 rounded-md">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="w-4 h-4 text-white"/>
          </div>
        </div>
      );
    } else {
      // Fallback for other media types
      return (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <div className="flex items-center gap-2 text-slate-300">

            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="w-4 h-4" />
            <span className="text-sm">Media: {mediaUrl.substring(0, 50)}...</span>
          </div>
        </div>
      );
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md w-full"
        >
          <div className="p-6 bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-2xl border border-green-500/30 mb-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Study Session Complete!</h2>
            <p className="text-slate-300 mb-4">
              You reviewed {flashcards.length} cards from {mockCollection.name}
            </p>
            <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
              <Target className="w-3 h-3 mr-1" />
              {completedCards.size}/{flashcards.length} completed
            </Badge>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Study Again
            </Button>
            <Link href="/collections">
              <Button variant="outline" className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Collections
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link href="/collections">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Collections</span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="p-1.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent truncate">
                    {mockCollection.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {currentCardIndex + 1}/{flashcards.length}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Study
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="outline"
                size="sm"
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Card</span>
              </Button>
              <Button 
                onClick={handleRestart}
                variant="outline" 
                size="sm"
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <Link href={`/collections/${collectionId}/manage`}>
                    <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer">
                      <List className="w-4 h-4 mr-2" />
                      Manage Flashcards
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem 
                    onClick={() => setShowSettingsModal(true)}
                    className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 min-w-fit">Progress</span>
            <Progress value={progress} className="flex-1 h-1.5 bg-slate-700" />
            <span className="text-xs text-slate-400 min-w-fit">{Math.round(progress)}%</span>
          </div>
        </div>
      </motion.header>

      {/* Flashcard Viewer */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Flashcard */}
              <div className="relative w-full min-h-[500px] mb-6">
                <motion.div
                  className="w-full h-[500px] cursor-pointer"
                  style={{ perspective: "1000px" }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {/* Front of card */}
                    <Card 
                      className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 shadow-2xl"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-lg border border-purple-500/50 flex items-center justify-center">
                              <Brain className="w-4 h-4 text-purple-300" />
                            </div>
                            <span className="text-sm text-slate-300 font-medium">Question</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Speaker Icon for Front Side Audio */}
                            {currentCard.audioUrl && (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAudio();
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full p-2"
                                  title="Play audio"
                                >
                                  <motion.div
                                    animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
                                  >
                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                  </motion.div>
                                </Button>
                              </motion.div>
                            )}
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEditModal(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                          <div className="prose prose-invert prose-slate max-w-none text-white">
                            <ReactMarkdown>
                              {currentCard.front}
                            </ReactMarkdown>
                          </div>
                          {getMediaElement(currentCard.frontMedia)}
                        </div>
                        
                        <div className="pt-4 border-t border-slate-600/50 mt-4">
                          <p className="text-slate-400 text-sm text-center">Tap to reveal answer</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Back of card */}
                    <Card 
                      className="absolute inset-0 bg-gradient-to-br from-blue-800 to-purple-900 border border-blue-600 shadow-2xl"
                      style={{ 
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                      }}
                    >
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-lg border border-blue-500/50 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-blue-300" />
                            </div>
                            <span className="text-sm text-slate-300 font-medium">Answer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Enhanced Speaker Icon for Back Side Audio */}
                            {currentCard.audioUrl && (
                              <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAudio();
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-full p-2 border border-green-500/30"
                                  title="Play pronunciation"
                                >
                                  <motion.div
                                    animate={isPlaying ? { 
                                      scale: [1, 1.3, 1],
                                      rotate: [0, 10, -10, 0]
                                    } : {}}
                                    transition={{ 
                                      repeat: isPlaying ? Infinity : 0, 
                                      duration: 0.8,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    {isPlaying ? (
                                      <Pause className="w-6 h-6" />
                                    ) : (
                                      <Volume2 className="w-6 h-6" />
                                    )}
                                  </motion.div>
                                </Button>
                              </motion.div>
                            )}
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEditModal(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                          <div className="prose prose-invert prose-blue max-w-none text-white">
                            <ReactMarkdown>
                              {currentCard.back}
                            </ReactMarkdown>
                          </div>
                          {getMediaElement(currentCard.backMedia)}
                        </div>
                        
                        {/* Show audio tip if available */}
                        {currentCard.audioUrl && (
                          <div className="pt-4 border-t border-blue-600/50 mt-4">
                            <div className="flex items-center justify-center gap-2 text-green-400">
                              <Volume2 className="w-4 h-4" />
                              <p className="text-sm">Audio available - tap speaker to play</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </div>

              {/* Difficulty Buttons */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                  >
                    {(['super_easy', 'easy', 'medium', 'hard'] as const).map((difficulty) => {
                      const config = getDifficultyConfig(difficulty);
                      const Icon = config.icon;
                      
                      return (
                        <motion.div
                          key={difficulty}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handleDifficultySelect(difficulty)}
                            className={`w-full h-auto p-3 lg:p-4 flex flex-col items-center gap-2 ${config.color}`}
                          >
                            <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                            <div className="text-center">
                              <div className="font-semibold text-sm">{config.label}</div>
                              <div className="text-xs opacity-90 mt-1 hidden lg:block">
                                {config.description}
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Audio Element */}
      {currentCard.audioUrl && (
        <audio
          ref={audioRef}
          src={currentCard.audioUrl}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />
      )}

      {/* Edit Flashcard Modal */}
      <FlashcardModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveFlashcard}
        flashcard={currentCard}
        mode="edit"
      />

      {/* Create Flashcard Modal */}
      <FlashcardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveFlashcard}
        mode="create"
      />

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent 
          className="bg-slate-800 border-slate-700 text-white max-w-md"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Study Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Daily Practice Limit */}
            <div className="space-y-2">
              <Label htmlFor="daily-limit" className="text-slate-300">
                Daily Practice Limit
              </Label>
              <Input
                id="daily-limit"
                type="number"
                value={settings.dailyPracticeLimit}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  dailyPracticeLimit: parseInt(e.target.value) || 20 
                }))}
                className="bg-slate-700 border-slate-600 text-white"
                min="1"
                max="100"
              />
              <p className="text-xs text-slate-400">
                Maximum number of cards to practice per day
              </p>
            </div>

            {/* Show Progress */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">Show Progress Bar</Label>
                <p className="text-xs text-slate-400">Display study progress while practicing</p>
              </div>
              <Switch
                checked={settings.showProgress}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  showProgress: checked 
                }))}
              />
            </div>

            {/* Auto Play Audio */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">Auto Play Audio</Label>
                <p className="text-xs text-slate-400">Automatically play audio when available</p>
              </div>
              <Switch
                checked={settings.autoPlayAudio}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  autoPlayAudio: checked 
                }))}
              />
            </div>

            {/* Difficulty Reminder */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">Difficulty Reminders</Label>
                <p className="text-xs text-slate-400">Show hints for difficulty selection</p>
              </div>
              <Switch
                checked={settings.difficultyReminder}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  difficultyReminder: checked 
                }))}
              />
            </div>

            {/* Study Reminders */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">Study Reminders</Label>
                <p className="text-xs text-slate-400">Get notified when it&apos;s time to study</p>
              </div>
              <Switch
                checked={settings.studyReminders}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  studyReminders: checked 
                }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => setShowSettingsModal(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowSettingsModal(false);
                toast.success("Settings Saved", {
                  description: "Your study preferences have been updated.",
                });
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}