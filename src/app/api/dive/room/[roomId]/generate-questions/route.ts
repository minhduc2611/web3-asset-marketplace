import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedQuestion {
  id: string;
  text: string;
  category: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    // Get all user submissions for this room
    const { data: submissions, error: submissionsError } = await supabase
      .from("dive_user_submissions")
      .select("*")
      .eq("room_id", roomId)
      .order("submitted_at", { ascending: true });

    if (submissionsError || !submissions || submissions.length === 0) {
      return NextResponse.json(
        { error: "No submissions found for this room" },
        { status: 400 }
      );
    }

    // Prepare context for OpenAI
    const participantsInfo = submissions.map((sub, index) => 
      `Participant ${index + 1} (${sub.name}):
- Interests: ${sub.interests}
- Wants to learn about: ${sub.want_to_learn}`
    ).join("\n\n");

    const prompt = `You are helping a group of friends have meaningful conversations. Based on the following information about the participants, generate 20 thoughtful, deep-dive questions that will help them connect and learn about each other.

${participantsInfo}

Generate 20 questions that:
1. Are open-ended and encourage storytelling
2. Connect to the participants' interests and what they want to learn
3. Range from light and fun to deeper, more personal topics
4. Help people discover common ground and unique perspectives
5. Encourage vulnerability and authentic sharing

Format each question as a JSON object with:
- "id": a unique identifier
- "text": the question text
- "category": one of "personal", "interests", "values", "experiences", "dreams", or "relationships"

Return only the JSON array of questions, no other text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a conversation facilitator who creates thoughtful questions for meaningful group discussions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    let questions: GeneratedQuestion[];
    try {
      questions = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse OpenAI response:", responseText);
      throw new Error("Invalid response format from OpenAI");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions generated");
    }

    // Store questions in database
    const questionsToInsert = questions.map((q: GeneratedQuestion) => ({
      id: uuidv4(),
      room_id: roomId,
      text: q.text,
      category: q.category || "general",
      created_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("dive_questions")
      .insert(questionsToInsert);

    if (insertError) {
      console.error("Error inserting questions:", insertError);
      return NextResponse.json(
        { error: "Failed to save questions" },
        { status: 500 }
      );
    }

    // Update room status
    const { error: updateError } = await supabase
      .from("dive_rooms")
      .update({ status: "questions" })
      .eq("room_id", roomId);

    if (updateError) {
      console.error("Error updating room status:", updateError);
    }

    return NextResponse.json({
      success: true,
      questionsCount: questions.length,
    });
  } catch (error) {
    console.error("Error in generate-questions API:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
} 