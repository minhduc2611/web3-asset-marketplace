import { NextRequest, NextResponse } from "next/server";
import { generate } from "./generate";
import { neo4jStorage } from "@/app/api/services/neo4j-storage";
import { tavily } from "@tavily/core";
import { searchChunksByCanvas } from "@/lib/weaviate";

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

    // Mark node as processing (add processing status to knowledge field temporarily)
    const currentKnowledge = sourceTopic.knowledge ? JSON.parse(sourceTopic.knowledge) : {};
    await neo4jStorage.updateTopic(sourceTopic.id, {
      knowledge: JSON.stringify({
        ...currentKnowledge,
        googleSearchStatus: "processing",
        searchStartedAt: new Date().toISOString(),
        searchQuery: query
      })
    });

    const handleCreateResultAndSaveToNeo4j = async () => {
      try {
        // First, fetch document search results to use as context for AI generation
        const documentResults = await searchChunksByCanvas(query, canvasId, 2);

        // Prepare document context for AI generation
        const documentContext = documentResults.map((chunk) => ({
          filename: chunk.filename,
          chunkId: chunk.chunkId,
          name: chunk.name,
          description: chunk.description,
          text: chunk.text,
          score: chunk.score,
        }));

        // Now run AI generation (with document context) and web search in parallel
        const [aiResponse, searchResults] = await Promise.allSettled([
          // AI generation with document context
          generate(nodeName, systemInstruction, topicPath.join(" > "), documentContext),
          
          // Tavily web search
          client.search(query, {
            topic: "news",
            searchDepth: "basic", // Changed to basic for faster execution
            includeRawContent: false, // Disabled for faster execution
            maxResults: 5, // Limit results
          }),
        ]);

        // Handle AI response
        const geminiAnswer = aiResponse.status === 'fulfilled' ? aiResponse.value || "" : "";
        if (!geminiAnswer) {
          // Mark as failed
          await neo4jStorage.updateTopic(sourceTopic.id, {
            knowledge: JSON.stringify({
              ...currentKnowledge,
              googleSearchStatus: "failed",
              searchCompletedAt: new Date().toISOString(),
              searchQuery: query,
              error: "Failed to generate AI response"
            })
          });
          return;
        }

        // Handle web search results
        const webSearchResults = searchResults.status === 'fulfilled' 
          ? searchResults.value.results.map(
              (result: { title: string; url: string; content: string }) => ({
                title: result.title,
                link: result.url,
                snippet: result.content,
                knowledge: result.content, // Use content instead of rawContent since rawContent is disabled
                displayLink: result.title,
                type: 'web'
              })
            )
          : [];

        // Handle document search results (already fetched)
        const documentSearchResults = documentResults.map((chunk) => ({
          title: `${chunk.filename} - ${chunk.name}`,
          snippet: chunk.text.substring(0, 200) + (chunk.text.length > 200 ? '...' : ''),
          knowledge: chunk.text,
          displayLink: chunk.filename,
          chunkId: chunk.chunkId,
          filename: chunk.filename,
          score: chunk.score,
          description: chunk.description,
          type: 'document'
        }));

        const finalResult = {
          searchResults: [...webSearchResults, ...documentSearchResults],
          webSearchResults,
          documentSearchResults,
          geminiAnswer,
          searchQuery: query,
          searchCompletedAt: new Date().toISOString(),
          searchStartedAt: currentKnowledge.searchStartedAt || new Date().toISOString(),
          documentContextUsed: documentContext.length > 0, // Track if documents were used in AI generation
        };

        // Save to neo4j - combine with existing knowledge
        const updatedKnowledge = {
          ...currentKnowledge,
          googleSearchStatus: "completed",
          latestGoogleSearch: finalResult,
          searchHistory: [
            ...(currentKnowledge.searchHistory || []),
            finalResult
          ].slice(-5) // Keep only last 5 searches
        };

        await neo4jStorage.updateTopic(sourceTopic.id, {
          knowledge: JSON.stringify(updatedKnowledge)
        });

        console.log(`Google search completed and saved for node: ${sourceTopic.id}`);
        console.log(`Found ${webSearchResults.length} web results and ${documentSearchResults.length} document chunks`);
        console.log(`Document context used in AI generation: ${documentContext.length > 0 ? 'Yes' : 'No'} (${documentContext.length} chunks)`);
      } catch (error) {
        console.error("Error in background Google search processing:", error);
        // Mark as failed with error details
        await neo4jStorage.updateTopic(sourceTopic.id, {
          knowledge: JSON.stringify({
            ...currentKnowledge,
            googleSearchStatus: "failed",
            searchCompletedAt: new Date().toISOString(),
            searchQuery: query,
            error: error instanceof Error ? error.message : "Unknown error occurred"
          })
        });
      }
    };

    // Run in background without awaiting
    handleCreateResultAndSaveToNeo4j();

    return NextResponse.json({
      searchResults: [],
      geminiAnswer: "",
      nodeId: sourceTopic.id,
      status: "processing",
      message: "Search results are being generated in the background. This includes web search, your document analysis, and AI insights that incorporate your personal knowledge base. This may take 40-60 seconds.",
      estimatedCompletionTime: 60 // seconds
    });
  } catch (error) {
    console.error("Error performing Google search:", error);
    return NextResponse.json(
      { message: "Failed to perform search. Please try again." },
      { status: 500 }
    );
  }
}

// Add GET endpoint to check search status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nodeId = searchParams.get('nodeId');
    
    if (!nodeId) {
      return NextResponse.json(
        { message: "Node ID is required" },
        { status: 400 }
      );
    }

    // Get the topic to check its knowledge field for search status
    const topic = await neo4jStorage.getTopicById(nodeId);
    
    if (!topic) {
      return NextResponse.json(
        { message: "Node not found" },
        { status: 404 }
      );
    }

    let searchStatus = "idle";
    let searchData = null;
    let error = null;

    if (topic.knowledge) {
      try {
        const knowledge = JSON.parse(topic.knowledge);
        searchStatus = knowledge.googleSearchStatus || "idle";
        
        if (searchStatus === "completed" && knowledge.latestGoogleSearch) {
          searchData = knowledge.latestGoogleSearch;
        } else if (searchStatus === "failed") {
          error = knowledge.error || "Search failed";
        }
      } catch (e) {
        console.error("Error parsing knowledge:", e);
      }
    }

    return NextResponse.json({
      nodeId,
      status: searchStatus,
      searchData,
      error
    });
  } catch (error) {
    console.error("Error checking search status:", error);
    return NextResponse.json(
      { message: "Failed to check search status" },
      { status: 500 }
    );
  }
}
