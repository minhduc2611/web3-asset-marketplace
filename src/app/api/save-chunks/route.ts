import { NextRequest, NextResponse } from 'next/server';
import { saveChunksToWeaviate, DocumentChunksData } from '@/lib/weaviate';

export async function POST(req: NextRequest) {
  try {
    const body: DocumentChunksData = await req.json();

    // Validate required fields
    if (!body.filename || !body.chunks || !Array.isArray(body.chunks)) {
      return NextResponse.json(
        { 
          message: "Invalid request body. Required fields: filename, chunks (array)",
          error: "validation_error"
        },
        { status: 400 }
      );
    }

    if (body.chunks.length === 0) {
      return NextResponse.json(
        { 
          message: "No chunks provided to save",
          error: "empty_chunks"
        },
        { status: 400 }
      );
    }

    // Validate chunk structure
    for (const chunk of body.chunks) {
      if (!chunk.id || !chunk.name || !chunk.text) {
        return NextResponse.json(
          { 
            message: "Invalid chunk structure. Each chunk must have: id, name, text",
            error: "invalid_chunk"
          },
          { status: 400 }
        );
      }
    }

    // Validate metadata
    if (!body.metadata || !body.metadata.createdAt) {
      return NextResponse.json(
        { 
          message: "Invalid metadata. Required fields: createdAt",
          error: "invalid_metadata"
        },
        { status: 400 }
      );
    }

    // Save chunks to Weaviate
    await saveChunksToWeaviate(body);

    return NextResponse.json(
      {
        message: "Chunks saved successfully",
        chunksCount: body.chunks.length,
        filename: body.filename
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Save chunks error:", error);
    
    // Handle specific Weaviate errors
    if (error instanceof Error) {
      if (error.message.includes('WEAVIATE_URL') || error.message.includes('WEAVIATE_API_KEY')) {
        return NextResponse.json(
          { 
            message: "Weaviate configuration error",
            error: "configuration_error"
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes('batch insert errors')) {
        return NextResponse.json(
          { 
            message: "Failed to save some chunks to Weaviate",
            error: "batch_insert_error",
            details: error.message
          },
          { status: 500 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        message: "Failed to save chunks",
        error: "internal_server_error"
      },
      { status: 500 }
    );
  }
} 