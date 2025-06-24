"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading?: boolean;
}

export default function TopicInput({ onSubmit, isLoading }: TopicInputProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTopic = topic.trim();
    if (trimmedTopic) {
      onSubmit(trimmedTopic);
      setTopic("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-slate-800 border-slate-600 text-slate-50 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500 w-full text-base touch-manipulation"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 touch-manipulation flex-shrink-0"
        size="default"
      >
        <span className="hidden sm:inline">Add Topic</span>
        <span className="sm:hidden">Add</span>
        <Plus className="w-4 h-4 ml-1 sm:ml-2" />
      </Button>
    </form>
  );
}
