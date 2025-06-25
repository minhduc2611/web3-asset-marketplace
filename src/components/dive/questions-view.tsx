"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  category: string;
}

interface QuestionsViewProps {
  roomId: string;
}

export function QuestionsView({ roomId }: QuestionsViewProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, [roomId]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(`/api/dive/room/${roomId}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        toast.error("Failed to load questions");
      }
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  };

  const copyQuestion = async (questionText: string) => {
    try {
      await navigator.clipboard.writeText(questionText);
      setCopiedQuestion(questionText);
      toast.success("Question copied to clipboard!");
      setTimeout(() => setCopiedQuestion(null), 2000);
    } catch {
      toast.error("Failed to copy question");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Questions...</h1>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Questions Available</h1>
          <p className="text-muted-foreground mb-6">
            Questions haven&apos;t been generated yet or there was an error.
          </p>
          <Button onClick={() => router.push("/dive")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Conversation Questions</h1>
        <p className="text-muted-foreground">
          Here are {questions.length} thoughtful questions to guide your discussion
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    Question {index + 1}
                  </Badge>
                  {question.category && (
                    <Badge variant="secondary" className="text-xs">
                      {question.category}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyQuestion(question.text)}
                  className="h-8 w-8 p-0"
                >
                  {copiedQuestion === question.text ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{question.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Tips for Great Conversations</CardTitle>
            <CardDescription>
              Make the most of these questions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Take turns answering questions to give everyone a chance to share</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Listen actively and ask follow-up questions to dive deeper</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Share personal stories and experiences to make connections</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Be open and vulnerable - meaningful conversations require authenticity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="outline"
          onClick={() => router.push("/dive")}
          className="max-w-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Create Another Room
        </Button>
      </div>
    </div>
  );
} 