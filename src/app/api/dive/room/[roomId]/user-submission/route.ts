import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    // For now, we'll use a simple approach based on session/local storage
    // In a real app, you'd want to track user sessions properly
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 404 }
      );
    }

    // Get user submission for this session
    const { data: submission, error } = await supabase
      .from("dive_user_submissions")
      .select("*")
      .eq("room_id", roomId)
      .eq("session_id", sessionId)
      .single();

    if (error || !submission) {
      return NextResponse.json(
        { error: "No submission found" },
        { status: 404 }
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
    console.error("Error in user-submission API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 