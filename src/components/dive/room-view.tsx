"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getSessionId } from "@/lib/session";
import { JoinRoomForm } from "./join-room-form";
import { UserSubmissionForm } from "./user-submission-form";
import { QuestionsView } from "./questions-view";

interface RoomData {
  roomId: string;
  passcode: string;
  participants: number;
  status: "waiting" | "ready" | "generating" | "questions";
}

interface UserSubmission {
  id: string;
  name: string;
  interests: string;
  wantToLearn: string;
  submitted_at: string;
}

export function RoomView({ roomId }: { roomId: string }) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [userSubmission, setUserSubmission] = useState<UserSubmission | null>(null);
  const [participants, setParticipants] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkRoomStatus();
  }, [roomId]);

  const checkRoomStatus = async () => {
    try {
      const response = await fetch(`/api/dive/room/${roomId}/status`);
      if (response.ok) {
        const data = await response.json();
        setRoomData(data.room);
        setParticipants(data.participants || []);
        
        // Check if user has already submitted
        const sessionId = getSessionId();
        if (sessionId) {
          const userSubmissionResponse = await fetch(`/api/dive/room/${roomId}/user-submission?sessionId=${sessionId}`);
          if (userSubmissionResponse.ok) {
            const submission = await userSubmissionResponse.json();
            setUserSubmission(submission);
          }
        }
      } else {
        toast.error("Room not found");
        router.push("/dive");
      }
    } catch {
      toast.error("Failed to load room");
      router.push("/dive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmissionSuccess = (submission: UserSubmission) => {
    setUserSubmission(submission);
    checkRoomStatus();
  };

  const handleGenerateQuestions = async () => {
    if (!roomData) return;
    
    setIsHost(true);
    try {
      const response = await fetch(`/api/dive/room/${roomId}/generate-questions`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      setRoomData(prev => prev ? { ...prev, status: "questions" } : null);
      toast.success("Questions generated successfully!");
    } catch {
      toast.error("Failed to generate questions");
    } finally {
      setIsHost(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
          <Button onClick={() => router.push("/dive")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show join form if user hasn't joined yet
  if (!userSubmission && roomData.status === "waiting") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Join Conversation</h1>
          <p className="text-muted-foreground">
            Room ID: <Badge variant="outline">{roomId}</Badge>
          </p>
        </div>
        <JoinRoomForm />
      </div>
    );
  }

  // Show submission form if user joined but hasn't submitted info
  if (!userSubmission && roomData.status === "ready") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to the Conversation!</h1>
          <p className="text-muted-foreground">
            Please share a bit about yourself to help generate meaningful questions
          </p>
        </div>
        <UserSubmissionForm roomId={roomId} onSubmissionSuccess={handleSubmissionSuccess} />
      </div>
    );
  }

  // Show waiting room if user submitted but waiting for others
  if (userSubmission && roomData.status === "ready") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Waiting for Everyone</h1>
          <p className="text-muted-foreground mb-4">
            {participants.length} participant{participants.length !== 1 ? "s" : ""} have joined
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="h-5 w-5" />
            <span className="text-lg font-medium">{participants.length}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>People who have joined the conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(participant.submitted_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            onClick={handleGenerateQuestions}
            disabled={isHost}
            size="lg"
            className="w-full max-w-md"
          >
            {isHost ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              "Generate Questions"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Show questions if they've been generated
  if (roomData.status === "questions") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <QuestionsView roomId={roomId} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <Button onClick={() => router.push("/dive")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
} 