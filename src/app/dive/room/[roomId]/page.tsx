import { Metadata } from "next";
import { RoomView } from "@/components/dive/room-view";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export const metadata: Metadata = {
  title: "Conversation Room",
  description: "Join the conversation and share your thoughts",
};

export default function RoomPage({ params }: RoomPageProps) {
  return <RoomView roomId={params.roomId} />;
} 