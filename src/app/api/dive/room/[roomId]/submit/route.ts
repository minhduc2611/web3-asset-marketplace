import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const body = await request.json();
    const { name, interests, wantToLearn, sessionId } = body;

    if (!name || !interests || !wantToLearn) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if room exists and is active
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

    if (room.status !== "active") {
      return NextResponse.json(
        { error: "Room is not active" },
        { status: 400 }
      );
    }

    // Check if user already submitted for this room
    if (sessionId) {
      const { data: existingSubmission } = await supabase
        .from("dive_user_submissions")
        .select("*")
        .eq("room_id", roomId)
        .eq("session_id", sessionId)
        .single();

      if (existingSubmission) {
        return NextResponse.json({
          id: existingSubmission.id,
          name: existingSubmission.name,
          interests: existingSubmission.interests,
          wantToLearn: existingSubmission.want_to_learn,
          submitted_at: existingSubmission.submitted_at,
        });
      }
    }

    // Create user submission
    const submissionId = uuidv4();
    const { data: submission, error: submissionError } = await supabase
      .from("dive_user_submissions")
      .insert({
        id: submissionId,
        room_id: roomId,
        session_id: sessionId,
        name: name.trim(),
        interests: interests.trim(),
        want_to_learn: wantToLearn.trim(),
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (submissionError) {
      console.error("Error creating submission:", submissionError);
      return NextResponse.json(
        { error: "Failed to submit information" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: submission.id,
      name: submission.name,
      interests: submission.interests,
      wantToLearn: submission.want_to_learn,
      submitted_at: submission.submitted_at,
    });
  } catch (error) {
    console.error("Error in submit API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 