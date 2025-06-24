"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  MessageCircle,
  Star,
  Send,
  Upload,
  X,
  Camera,
  FileVideo,
  Heart,
  Lightbulb,
  Bug,
  Sparkles
} from "lucide-react";

interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  email: string;
  files: File[];
}

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    category: "",
    message: "",
    email: "",
    files: []
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const feedbackCategories = [
    { id: "general", label: "General Feedback", icon: Heart, color: "text-pink-400" },
    { id: "feature", label: "Feature Request", icon: Lightbulb, color: "text-yellow-400" },
    { id: "bug", label: "Bug Report", icon: Bug, color: "text-red-400" },
    { id: "improvement", label: "Improvement", icon: Sparkles, color: "text-purple-400" }
  ];

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: FeedbackData) => {
      const formData = new FormData();
      formData.append('rating', feedbackData.rating.toString());
      formData.append('category', feedbackData.category);
      formData.append('message', feedbackData.message);
      formData.append('email', feedbackData.email);
      
      feedbackData.files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      return apiRequest("POST", "/api/feedback/submit", formData);
    },
    onSuccess: () => {
      toast.success("Feedback Submitted! 🎉", {
        description: "Thank you for helping us improve MindGraph. We'll review your feedback soon.",
      });
      setIsOpen(false);
      setFeedback({
        rating: 0,
        category: "",
        message: "",
        email: "",
        files: []
      });
    },
    onError: () => {
      toast.error("Submission Failed", {
        description: "Failed to submit feedback. Please try again.",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error("Invalid Files", {
        description: "Only images and videos under 10MB are allowed.",
      });
    }

    setFeedback(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles].slice(0, 5) // Max 5 files
    }));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setFeedback(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles].slice(0, 5)
    }));
  };

  const removeFile = (index: number) => {
    setFeedback(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!feedback.rating || !feedback.category || !feedback.message.trim()) {
      toast.error("Incomplete Form", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    submitFeedbackMutation.mutate(feedback);
  };

  const getRatingText = (rating: number) => {
    switch(rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Rate your experience";
    }
  };

  return (
    <>
      {/* Fixed Feedback Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
        
        {/* Floating tooltip */}
        <motion.div
          className="absolute bottom-16 right-0 bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          Share your feedback
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
        </motion.div>
      </motion.div>

      {/* Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-slate-900/95 border-slate-700 text-white max-h-[90vh] sm:max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Help Us Improve MindGraph
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-slate-300 text-sm">
              Your feedback helps us build a better learning experience. Tell us what you think!
            </p>

            {/* Rating Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-300">
                How would you rate your experience? *
              </Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredStar || feedback.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </motion.button>
                ))}
                <span className="ml-3 text-sm text-slate-400">
                  {getRatingText(hoveredStar || feedback.rating)}
                </span>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-300">
                What type of feedback is this? *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {feedbackCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setFeedback(prev => ({ ...prev, category: category.id }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      feedback.category === category.id
                        ? 'border-purple-500 bg-purple-600/10'
                        : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className={`w-4 h-4 ${category.color}`} />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-300">
                Tell us more about your experience *
              </Label>
              <Textarea
                placeholder="Share your thoughts, suggestions, or report any issues you've encountered..."
                value={feedback.message}
                onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 min-h-[100px] resize-none"
              />
            </div>

            {/* Email (Optional) */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-300">
                Email (optional - for follow-up)
              </Label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={feedback.email}
                onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-300">
                Screenshots or Videos (optional)
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver
                    ? 'border-purple-500 bg-purple-600/10'
                    : 'border-slate-600 bg-slate-800/50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <div className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <FileVideo className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-400">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-xs text-slate-500">
                    Max 5 files, 10MB each (images & videos only)
                  </p>
                </div>
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* File Preview */}
              {feedback.files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {feedback.files.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="bg-slate-700 rounded-lg p-2 text-center">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 flex items-center justify-center">
                            <FileVideo className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                      <Button
                        onClick={() => removeFile(index)}
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!feedback.rating || !feedback.category || !feedback.message.trim() || submitFeedbackMutation.isPending}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                {submitFeedbackMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}