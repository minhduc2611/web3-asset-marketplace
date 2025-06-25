"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getSessionId } from "@/lib/session";

interface UserSubmission {
  id: string;
  name: string;
  interests: string;
  wantToLearn: string;
  submitted_at: string;
}

interface UserSubmissionFormProps {
  roomId: string;
  onSubmissionSuccess: (submission: UserSubmission) => void;
}

export function UserSubmissionForm({ roomId, onSubmissionSuccess }: UserSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    interests: "",
    wantToLearn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.interests.trim() || !formData.wantToLearn.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/dive/room/${roomId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit information");
      }

      const submission = await response.json();
      onSubmissionSuccess(submission);
      toast.success("Information submitted successfully!");
    } catch {
      toast.error("Failed to submit information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tell Us About Yourself</CardTitle>
        <CardDescription>
          This information will help generate meaningful questions for the group discussion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Your Interests</Label>
            <Textarea
              id="interests"
              placeholder="What are you passionate about? What do you enjoy doing in your free time?"
              value={formData.interests}
              onChange={(e) => handleInputChange("interests", e.target.value)}
              disabled={isSubmitting}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wantToLearn">What You Want to Learn About Others</Label>
            <Textarea
              id="wantToLearn"
              placeholder="What would you like to know about the other participants? What topics interest you?"
              value={formData.wantToLearn}
              onChange={(e) => handleInputChange("wantToLearn", e.target.value)}
              disabled={isSubmitting}
              rows={3}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 