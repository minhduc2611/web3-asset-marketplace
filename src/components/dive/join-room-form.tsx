"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function JoinRoomForm() {
  const [isJoining, setIsJoining] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [passcode, setPasscode] = useState("");
  const router = useRouter();

  const joinRoom = async (identifier: string, type: "roomId" | "passcode") => {
    setIsJoining(true);
    try {
      const response = await fetch("/api/dive/join-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [type]: identifier,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to join room");
      }

      const data = await response.json();
      toast.success("Room joined successfully!");
      router.push(`/dive/room/${data.roomId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to join room");
    } finally {
      setIsJoining(false);
    }
  };

  const handleRoomIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    joinRoom(roomId.trim(), "roomId");
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      toast.error("Please enter a passcode");
      return;
    }
    joinRoom(passcode.trim(), "passcode");
  };

  return (
    <Tabs defaultValue="roomId" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="roomId">Room ID</TabsTrigger>
        <TabsTrigger value="passcode">Passcode</TabsTrigger>
      </TabsList>
      
      <TabsContent value="roomId" className="mt-6">
        <form onSubmit={handleRoomIdSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomId">Room ID</Label>
            <Input
              id="roomId"
              type="text"
              placeholder="Enter room ID (e.g., abc123)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isJoining}
            />
          </div>
          <Button
            type="submit"
            disabled={isJoining || !roomId.trim()}
            className="w-full"
            size="lg"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="passcode" className="mt-6">
        <form onSubmit={handlePasscodeSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passcode">Passcode</Label>
            <Input
              id="passcode"
              type="text"
              placeholder="Enter passcode (e.g., 123456)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={isJoining}
            />
          </div>
          <Button
            type="submit"
            disabled={isJoining || !passcode.trim()}
            className="w-full"
            size="lg"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
} 