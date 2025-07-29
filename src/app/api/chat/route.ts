import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/shared/schema";
import { getWeaviateClient, CHUNK_COLLECTION_NAME } from "@/lib/weaviate";
import OpenAI from "openai";
import { tavily } from "@tavily/core";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key",
});

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
if (!process.env.TAVILY_API_KEY) {
  console.warn("TAVILY_API_KEY is not set - web search will be disabled");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = chatRequestSchema.parse(body);
    // Note: canvasId support will be added when canvas-specific document filtering is implemented

    // Run both searches in parallel for better performance
    const [weaviateResult, tavilyResult] = await Promise.allSettled([
      // Weaviate search for user's documents
      (async () => {
        const client = await getWeaviateClient();
        const collection = client.collections.get(CHUNK_COLLECTION_NAME);
        return await collection.query.nearText(message, {
          limit: 3, 
          returnMetadata: ['distance'], // Get relevance scores
        });
      })(),
      
      // Tavily search for web results (with timeout and error handling)
      process.env.TAVILY_API_KEY ? (async () => {
        const searchPromise = tavilyClient.search(message, {
          searchDepth: "basic",
          includeRawContent: false,
          maxResults: 3,
        }) as Promise<{
          results: { title: string; url: string; content: string }[];
        }>;
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Tavily search timeout")), 10000)
        );
        
        return await Promise.race([searchPromise, timeoutPromise]);
      })() : Promise.resolve(null)
    ]);

    // Extract document context from Weaviate results
    let contextChunks: Array<{
      filename: string;
      text: string;
      relevanceScore?: number;
    }> = [];

    if (weaviateResult.status === 'fulfilled' && weaviateResult.value) {
      contextChunks = weaviateResult.value.objects.map((item) => ({
        filename: item.properties.filename as string,
        text: item.properties.text as string,
        relevanceScore: item.metadata?.distance ? 1 - item.metadata.distance : undefined,
      }));
    }

    // Extract web search results from Tavily
    let webSearchResults: Array<{
      title: string;
      url: string;
      content: string;
    }> = [];

    if (tavilyResult.status === 'fulfilled' && tavilyResult.value && tavilyResult.value.results) {
      webSearchResults = tavilyResult.value.results.slice(0, 3).map((result: { title: string; url: string; content: string }) => ({
        title: result.title,
        url: result.url,
        content: result.content,
      }));
    } else if (tavilyResult.status === 'rejected') {
      console.warn("Tavily search failed:", tavilyResult.reason);
    }

    // Prepare context sections
    const documentContext = contextChunks.length > 0 
      ? contextChunks
          .map((chunk, index) => 
            `[Document ${index + 1}: ${chunk.filename}]\n${chunk.text}`
          )
          .join('\n\n---\n\n')
      : "";

    const webContext = webSearchResults.length > 0
      ? webSearchResults
          .map((result, index) => 
            `[Web Source ${index + 1}: ${result.title}]\nURL: ${result.url}\n${result.content}`
          )
          .join('\n\n---\n\n')
      : "";

    // Create comprehensive context
    const contextSections = [];
    if (documentContext) {
      contextSections.push(`**Your Documents:**\n${documentContext}`);
    }
    if (webContext) {
      contextSections.push(`**Web Search Results:**\n${webContext}`);
    }
    
    const fullContext = contextSections.length > 0 
      ? contextSections.join('\n\n=====\n\n')
      : "No relevant context found.";

    // Create system message with both contexts
    const systemMessage = `You are an AI assistant helping users explore and understand their knowledge base and provide real-time information.

You have access to the following information:

${fullContext}

Instructions:
- Use both the user's documents and web search results to provide comprehensive answers
- When referencing information, clearly indicate whether it's from the user's documents or web sources
- If using web sources, mention the source titles when relevant
- If the available context doesn't contain relevant information, say so clearly
- Be helpful, accurate, and conversational
- For current events or recent information, prioritize web search results
- For personal knowledge or document-specific questions, prioritize the user's documents
- Current time: ${new Date().toLocaleString()}`;

    // Create a streaming response
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send sources information if available
          const allSources = [
            ...contextChunks.map(chunk => ({
              type: 'document' as const,
              filename: chunk.filename,
              text: chunk.text,
              relevanceScore: chunk.relevanceScore
            })),
            ...webSearchResults.map(result => ({
              type: 'web' as const,
              title: result.title,
              url: result.url,
              content: result.content
            }))
          ];

          if (allSources.length > 0) {
            const sourcesData = {
              type: 'sources',
              sources: allSources
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(sourcesData)}\n\n`));
          }

          // Generate AI response using OpenAI streaming
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: message }
            ],
            max_tokens: 1500,
            temperature: 0.7,
            stream: true,
          });

          // Stream the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const data = {
                type: 'content',
                content: content
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            }
          }

          // Send completion signal
          const endData = {
            type: 'end',
            success: true
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(endData)}\n\n`));
          
        } catch (error) {
          console.error("Streaming error:", error);
          const errorData = {
            type: 'error',
            message: "I'm sorry, I encountered an error while processing your request. Please try again."
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Error in chat endpoint:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: "I'm sorry, I encountered an error while processing your request. Please try again.",
          success: false 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "An unexpected error occurred. Please try again.",
        success: false 
      },
      { status: 500 }
    );
  }
} 