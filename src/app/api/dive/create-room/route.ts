import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    // Generate unique room ID and passcode
    const roomId = uuidv4().substring(0, 8);
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert room into database
    const { error } = await supabase
      .from("dive_rooms")
      .insert({
        room_id: roomId,
        passcode: passcode,
        created_at: new Date().toISOString(),
        status: "active",
      });

    if (error) {
      console.error("Error creating room:", error);
      return NextResponse.json(
        { error: "Failed to create room" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      roomId,
      passcode,
    });
  } catch (error) {
    console.error("Error in create-room API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 