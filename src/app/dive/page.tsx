import { Metadata } from "next";
import { CreateRoomForm } from "@/components/dive/create-room-form";
import { JoinRoomForm } from "@/components/dive/join-room-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Dive - Meaningful Conversations",
  description: "Create or join a room for meaningful group conversations",
};

export default function DivePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Dive into Meaningful Conversations
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect with friends through thoughtful questions and deep discussions
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Room</TabsTrigger>
          <TabsTrigger value="join">Join Room</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Room</CardTitle>
              <CardDescription>
                Start a conversation room and invite your friends to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateRoomForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="join" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Join a Room</CardTitle>
              <CardDescription>
                Enter a room code to join an existing conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JoinRoomForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
