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

    const aiResponse = await generate(nodeName, systemInstruction, topicPath.join(" > "));
    const geminiAnswer = aiResponse || "";
    if (!aiResponse) {
      return NextResponse.json(
        { message: "Failed to perform search. Please try again." },
        { status: 500 }
      );
    }
    // Mock Google search results for demonstration
    const searchResults =  await client.search(query, {
      topic: "news",
      searchDepth: "advanced",
      includeRawContent: "text"
  })
    const searchResultsJson = searchResults.results.map((result) => ({
      title: result.title,
      link: result.url,
      snippet: result.content,
      knowledge: result.rawContent,
      displayLink: result.title
    }));
    
    // [
    //   {
    //     title: `${query} - Wikipedia`,
    //     link: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
    //     snippet: `Learn about ${query} from the world's largest encyclopedia. Comprehensive information, history, and related topics.`,
    //     displayLink: "en.wikipedia.org"
    //   },
    //   {
    //     title: `${query} - Latest News and Updates`,
    //     link: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
    //     snippet: `Stay updated with the latest news and developments about ${query}. Real-time coverage from trusted sources.`,
    //     displayLink: "news.google.com"
    //   },
    //   {
    //     title: `Research and Analysis: ${query}`,
    //     link: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
    //     snippet: `Academic research and scholarly articles about ${query}. Peer-reviewed papers and scientific studies.`,
    //     displayLink: "scholar.google.com"
    //   },
    //   {
    //     title: `${query} - Complete Guide and Resources`,
    //     link: `https://example.com/${encodeURIComponent(query)}`,
    //     snippet: `Comprehensive guide covering everything you need to know about ${query}. Tutorials, tips, and expert insights.`,
    //     displayLink: "example.com"
    //   }
    // ];

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