"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

export function CreateRoomForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [roomData, setRoomData] = useState<{ roomId: string; passcode: string } | null>(null);
  const router = useRouter();

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/dive/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      setRoomData(data);
      toast.success("Room created successfully!");
    } catch {
      toast.error("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string, type: "room" | "passcode") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type === "room" ? "Room link" : "Passcode"} copied to clipboard!`);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const generateQRCode = () => {
    if (!roomData) return;
    
    const roomUrl = `${window.location.origin}/dive/room/${roomData.roomId}`;
    // For now, we'll use a simple QR code service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(roomUrl)}`;
    
    // Open QR code in new window
    window.open(qrCodeUrl, "_blank");
  };

  if (roomData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Room Created Successfully!</h3>
          <p className="text-muted-foreground mb-4">
            Share this information with your friends to join the conversation
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Room Link</CardTitle>
              <CardDescription>Share this link with your friends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  value={`${window.location.origin}/dive/room/${roomData.roomId}`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`${window.location.origin}/dive/room/${roomData.roomId}`, "room")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Passcode</CardTitle>
              <CardDescription>Alternative way to join the room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {roomData.passcode}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(roomData.passcode, "passcode")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={generateQRCode} className="flex-1">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dive/room/${roomData.roomId}`)}
            >
              Go to Room
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Create a new conversation room. You&apos;ll get a unique room ID and passcode to share with friends.
        </p>
      </div>
      
      <Button
        onClick={createRoom}
        disabled={isCreating}
        className="w-full"
        size="lg"
      >
        {isCreating ? "Creating Room..." : "Create Room"}
      </Button>
    </div>
  );
} 