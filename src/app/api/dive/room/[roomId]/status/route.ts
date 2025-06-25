import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    // Get room information
    const { data: room, error: roomError } = await supabase
      .from("dive_rooms")
      .select("*")
      .eq("room_id", roomId)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from("dive_user_submissions")
      .select("*")
      .eq("room_id", roomId)
      .order("submitted_at", { ascending: true });

    if (participantsError) {
      console.error("Error fetching participants:", participantsError);
    }

    return NextResponse.json({
      room: {
        roomId: room.room_id,
        passcode: room.passcode,
        participants: participants?.length || 0,
        status: room.status,
      },
      participants: participants || [],
    });
  } catch (error) {
    console.error("Error in room status API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 