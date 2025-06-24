import { NextResponse } from "next/server";
import OpenAI from "openai";

interface Flashcard {
  front: string;
  back: string;
}

interface AIResponse {
  flashcards: Flashcard[];
}

interface RequestBody {
  prompt: string;
  count?: string | number;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, count } = (await req.json()) as RequestBody;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { message: "Prompt is required" } as ErrorResponse,
        { status: 400 }
      );
    }

    const cardCount = Math.min(Math.max(parseInt(count as string) || 5, 1), 20);

    const aiPrompt = `${prompt}

Create exactly ${cardCount} educational flashcards in markdown format. Each flashcard should have:
- Front side: A clear, concise question or prompt
- Back side: A comprehensive answer with explanations, examples, and key points

Format requirements:
- Use proper markdown formatting (headers, bold, italic, lists, code blocks)
- Include examples where relevant
- Make them educational and memorable
- Keep front sides as questions or prompts
- Make back sides detailed but not overwhelming
- Use emojis sparingly for visual appeal
- Ensure variety in question types and difficulty

Return a JSON object with a "flashcards" array containing exactly ${cardCount} objects, each with "front" and "back" properties.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert educator who creates high-quality flashcards for learning. Always respond with valid JSON containing exactly ${cardCount} flashcards with front and back markdown content.`,
        },
        {
          role: "user",
          content: aiPrompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}") as AIResponse;

    if (!result.flashcards || !Array.isArray(result.flashcards)) {
      throw new Error("Invalid response format from AI");
    }

    // Ensure we have the right number of cards
    const flashcards = result.flashcards.slice(0, cardCount).map((card: Flashcard) => ({
      front: card.front || "No front content",
      back: card.back || "No back content",
    }));

    return NextResponse.json({
      flashcards,
      count: flashcards.length,
      generated_by: "AI",
    });
  } catch (error) {
    console.error("Error generating bulk flashcards:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        message: "Failed to generate bulk flashcards",
        error: errorMessage,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
