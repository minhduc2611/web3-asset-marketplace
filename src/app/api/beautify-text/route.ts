import { NextResponse } from "next/server";
import OpenAI from "openai";

interface RequestBody {
  text: string;
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
    const { text } = (await req.json()) as RequestBody;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { message: "Text is required" } as ErrorResponse,
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        {
          message: "Text is too long (max 50,000 characters)",
        } as ErrorResponse,
        { status: 400 }
      );
    }

    const aiPrompt = `Please beautify and improve the following text by:
<rules>
- Remove excessive line breaks
- Enhancing readability and clarity
- Adding proper paragraph breaks where needed
- Maintaining the original meaning and content
- Removing unrelated texts such as headers, footers, and other non-content text
- Keeping the content structure like abstract, introduction, body, conclusion, etc.
- ALWAYS Keep the numbering OF THE CONTENT like 1. 2. 3. 4. 5. ; A. B. C. D. E.; I. II. III. IV. V., and so on.
</rules>
<format>
IMPORTANT: Return ONLY the beautified text in plain text format. Do NOT use markdown formatting, headers, or any special formatting. Just return clean, well-written text.
</format>
<text_to_beautify>
${text}
</text_to_beautify>
`;
    console.log("---text---\n", text.slice(0, 100));
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert editor who improves text clarity and readability. Always respond with plain text only, no markdown or special formatting.",
        },
        {
          role: "user",
          content: aiPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const beautifiedText = response.choices[0].message.content?.trim() || text;

    return NextResponse.json({
      beautifiedText,
      originalLength: text.length,
      beautifiedLength: beautifiedText.length,
    });
  } catch (error) {
    console.error("Error beautifying text:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        message: "Failed to beautify text",
        error: errorMessage,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
