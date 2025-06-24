"use client"
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Brain, Trash2, Copy, Calendar } from 'lucide-react';

import { toast } from "sonner"

interface SavedText {
  id: string;
  text: string;
  timestamp: string;
  source: string;
}

export default function MemoryViewer() {
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
  const [open, setOpen] = useState(false);


  const loadSavedTexts = () => {
    try {
      const texts = JSON.parse(localStorage.getItem('highlightedTexts') || '[]');
      setSavedTexts(texts.reverse()); // Show newest first
    } catch (error) {
      console.error('Error loading saved texts:', error);
      setSavedTexts([]);
    }
  };

  const deleteText = (id: string) => {
    try {
      const texts = JSON.parse(localStorage.getItem('highlightedTexts') || '[]');
      const filteredTexts = texts.filter((text: SavedText) => text.id !== id);
      localStorage.setItem('highlightedTexts', JSON.stringify(filteredTexts));
      loadSavedTexts();
      toast.success("Text deleted", {
        description: "The highlighted text has been removed from memory.",
      });
    } catch {
      toast.error("Error deleting text", {
        description: "Failed to delete text from memory.",
      });
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Text copied", {
        description: "The text has been copied to your clipboard.",
      });
    }).catch(() => {
      toast.error("Copy failed", {
        description: "Failed to copy text to clipboard.",
      });
    });
  };

  const clearAllTexts = () => {
    localStorage.removeItem('highlightedTexts');
    setSavedTexts([]);
    toast.success("Memory cleared", {
      description: "All saved texts have been removed.",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    if (open) {
      loadSavedTexts();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Brain className="h-4 w-4" />
          Memory ({savedTexts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl sm:max-h-[80vh] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Saved Text Memory
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {savedTexts.length} {savedTexts.length === 1 ? 'text' : 'texts'} saved
          </p>
          {savedTexts.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearAllTexts}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        <ScrollArea className="h-[500px] w-full pr-4">
          {savedTexts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No highlighted texts saved yet.</p>
              <p className="text-sm mt-2">Highlight text in modals and save it to memory.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedTexts.map((savedText) => (
                <Card key={savedText.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {savedText.source}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(savedText.timestamp)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed mb-3 select-text">
                      {savedText.text}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyText(savedText.text)}
                        className="gap-2"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteText(savedText.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}