"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { apiRequest } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import { 
  Plus, 
  Edit, 
  Image, 
  Video, 
  Volume2, 
  Eye, 
  Save,
  FileText,
  Sparkles,
  Bot,
  Loader2,
  Wand2
} from "lucide-react";

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (flashcard: any) => void;
  flashcard?: any;
  mode: 'create' | 'edit';
}

export default function FlashcardModal({ 
  isOpen, 
  onClose, 
  onSave, 
  flashcard, 
  mode 
}: FlashcardModalProps) {
  const [front, setFront] = useState(flashcard?.front || "");
  const [back, setBack] = useState(flashcard?.back || "");
  const [frontMedia, setFrontMedia] = useState(flashcard?.frontMedia || "");
  const [backMedia, setBackMedia] = useState(flashcard?.backMedia || "");
  const [audioUrl, setAudioUrl] = useState(flashcard?.audioUrl || "");
  const [activeTab, setActiveTab] = useState("front");
  const [previewMode, setPreviewMode] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleSave = () => {
    if (!front.trim() || !back.trim()) {
      toast.error("Validation Error", {
        description: "Both front and back content are required",
      });
      return;
    }

    const flashcardData = {
      id: flashcard?.id || Date.now().toString(),
      front: front.trim(),
      back: back.trim(),
      frontMedia: frontMedia.trim(),
      backMedia: backMedia.trim(),
      audioUrl: audioUrl.trim(),
      difficulty: flashcard?.difficulty || 0,
      reviewCount: flashcard?.reviewCount || 0,
      createdAt: flashcard?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(flashcardData);
    onClose();
    
    toast.success(mode === 'create' ? "Flashcard Created" : "Flashcard Updated", {
      description: `Successfully ${mode === 'create' ? 'created' : 'updated'} flashcard`,
    });
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      toast.error("Topic Required", {
        description: "Please enter a topic for AI generation",
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await apiRequest('POST', '/api/generate-flashcard', {
        topic: aiTopic.trim()
      });
      const data = await response.json();
      
      setFront(data.front);
      setBack(data.back);
      setPreviewMode(false);
      setActiveTab("front");
      
      toast.success("AI Generated Successfully", {
        description: "Flashcard content has been generated with AI",
      });
    } catch (error: any) {
      console.error("AI generation failed:", error);
      toast.error("AI Generation Failed", {
        description: error.message || "Failed to generate content. Please try again.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleClose = () => {
    setFront(flashcard?.front || "");
    setBack(flashcard?.back || "");
    setFrontMedia(flashcard?.frontMedia || "");
    setBackMedia(flashcard?.backMedia || "");
    setAudioUrl(flashcard?.audioUrl || "");
    setActiveTab("front");
    setPreviewMode(false);
    setAiTopic("");
    setIsGeneratingAI(false);
    onClose();
  };

  const getMediaPreview = (mediaUrl: string) => {
    if (!mediaUrl) return null;
    
    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
    
    if (isVideo) {
      return (
        <video 
          src={mediaUrl} 
          controls 
          className="w-full max-h-40 rounded-lg border border-slate-600"
          preload="metadata"
        />
      );
    } else if (isImage) {
      return (
        <img 
          src={mediaUrl} 
          alt="Media preview" 
          className="w-full max-h-40 object-cover rounded-lg border border-slate-600"
        />
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900/95 border-slate-700 text-white overflow-hidden">
        <DialogHeader className="pb-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                {mode === 'create' ? (
                  <Plus className="w-5 h-5 text-purple-400" />
                ) : (
                  <Edit className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {mode === 'create' ? 'Create New Flashcard' : 'Edit Flashcard'}
                </DialogTitle>
                <p className="text-slate-400 text-sm mt-1">
                  Use markdown for rich formatting
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* AI Generation Section */}
        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-blue-300">Generate with AI</span>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., React Hooks, Spanish verbs, Biology...)"
                  className="bg-slate-800/50 border-slate-600 text-white flex-1"
                  style={{ fontSize: '16px' }}
                  disabled={isGeneratingAI}
                />
                <Button
                  onClick={handleGenerateWithAI}
                  disabled={isGeneratingAI || !aiTopic.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 min-w-[120px]"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                AI will create front and back content in markdown format with examples and explanations
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 mb-4">
              <TabsTrigger value="front" className="data-[state=active]:bg-slate-700">
                <FileText className="w-4 h-4 mr-2" />
                Front Side
              </TabsTrigger>
              <TabsTrigger value="back" className="data-[state=active]:bg-slate-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Back Side
              </TabsTrigger>
            </TabsList>

            <div className="h-[calc(100vh-280px)] overflow-y-auto space-y-4">
              <TabsContent value="front" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="front-content">Front Content (Markdown)</Label>
                  {previewMode ? (
                    <div className="min-h-[200px] p-4 bg-slate-800/50 border border-slate-600 rounded-lg">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>
                          {front || "*No content*"}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <Textarea
                      id="front-content"
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      placeholder="Enter the question or prompt..."
                      className="min-h-[200px] bg-slate-800/50 border-slate-600 text-white resize-none"
                      style={{ fontSize: '16px' }} // Prevents zoom on mobile
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="front-media">Media URL (Image/Video)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="front-media"
                        value={frontMedia}
                        onChange={(e) => setFrontMedia(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="bg-slate-800/50 border-slate-600 text-white pl-10"
                        style={{ fontSize: '16px' }}
                      />
                      <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  {frontMedia && getMediaPreview(frontMedia)}
                </div>
              </TabsContent>

              <TabsContent value="back" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="back-content">Back Content (Markdown)</Label>
                  {previewMode ? (
                    <div className="min-h-[200px] p-4 bg-slate-800/50 border border-slate-600 rounded-lg prose prose-invert max-w-none">
                      <ReactMarkdown>
                        {back || "*No content*"}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <Textarea
                      id="back-content"
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      placeholder="Enter the answer or explanation..."
                      className="min-h-[200px] bg-slate-800/50 border-slate-600 text-white resize-none"
                      style={{ fontSize: '16px' }}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="back-media">Media URL (Image/Video)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="back-media"
                        value={backMedia}
                        onChange={(e) => setBackMedia(e.target.value)}
                        placeholder="https://example.com/diagram.png"
                        className="bg-slate-800/50 border-slate-600 text-white pl-10"
                        style={{ fontSize: '16px' }}
                      />
                      <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  {backMedia && getMediaPreview(backMedia)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio-url">Audio URL (Optional)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="audio-url"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                        className="bg-slate-800/50 border-slate-600 text-white pl-10"
                        style={{ fontSize: '16px' }}
                      />
                      <Volume2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  {audioUrl && (
                    <audio controls className="w-full">
                      <source src={audioUrl} />
                      Your browser does not support audio playback.
                    </audio>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
              <FileText className="w-3 h-3 mr-1" />
              Markdown Supported
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Create Card' : 'Update Card'}
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}