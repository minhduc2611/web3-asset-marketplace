import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, passcode } = body;

    if (!roomId && !passcode) {
      return NextResponse.json(
        { error: "Room ID or passcode is required" },
        { status: 400 }
      );
    }

    let query = supabase.from("dive_rooms").select("*");

    if (roomId) {
      query = query.eq("room_id", roomId);
    } else if (passcode) {
      query = query.eq("passcode", passcode);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    if (data.status !== "active") {
      return NextResponse.json(
        { error: "Room is not active" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      roomId: data.room_id,
      passcode: data.passcode,
    });
  } catch (error) {
    console.error("Error in join-room API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 