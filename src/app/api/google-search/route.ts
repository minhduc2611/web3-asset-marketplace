import { NextRequest, NextResponse } from 'next/server';
import { generate } from './generate';
import { neo4jStorage } from "@/app/api/services/neo4j-storage";
import { tavily } from "@tavily/core";
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
if (!process.env.TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not set");
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, canvasId } = body;
    const nodeName = query;

    if (!nodeName || nodeName.trim() === "") {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }


    // 1. Fetch the source topic node to get its ID
    const sourceTopic = await neo4jStorage.getTopicByName(nodeName, canvasId);
    if (!sourceTopic) {
      return NextResponse.json(
        { message: "Source topic not found" },
        { status: 404 }
      );
    }

    // 2. Get the hierarchical path, existing siblings, and children for context
    const topicPath = await neo4jStorage.getTopicPath(sourceTopic.id, canvasId);

    // Get canvas system instruction if canvasId is provided
    let systemInstruction = "";
    if (canvasId) {
      const canvas = await neo4jStorage.getCanvas(canvasId);
      systemInstruction = canvas?.systemInstruction || "";
    }

    // Run both AI generation and search in parallel for faster execution
    const [aiResponse, searchResults] = await Promise.all([
      generate(nodeName, systemInstruction, topicPath.join(" > ")),
      client.search(query, {
        topic: "news",
        searchDepth: "basic", // Changed to basic for faster execution
        includeRawContent: false, // Disabled for faster execution
        maxResults: 5 // Limit results
      })
    ]);

    const geminiAnswer = aiResponse || "";
    if (!aiResponse) {
      return NextResponse.json(
        { message: "Failed to perform search. Please try again." },
        { status: 500 }
      );
    }

    const searchResultsJson = searchResults.results.map((result: { title: string; url: string; content: string }) => ({
      title: result.title,
      link: result.url,
      snippet: result.content,
      knowledge: result.content, // Use content instead of rawContent since rawContent is disabled
      displayLink: result.title
    }));

    return NextResponse.json({
      searchResults: searchResultsJson,
      geminiAnswer
    });
  } catch (error) {
    console.error("Error performing Google search:", error);
    return NextResponse.json(
      { message: "Failed to perform search. Please try again." },
      { status: 500 }
    );
  }
} 