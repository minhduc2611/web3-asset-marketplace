import { NextRequest, NextResponse } from 'next/server';
import { createCanvasSchema } from '@/shared/schema';
import { neo4jStorage } from '@/app/api/services/neo4j-storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, authorId } = createCanvasSchema.parse(body);
    
    const newCanvas = await neo4jStorage.createCanvas({
      name,
      authorId
    });

    return NextResponse.json(newCanvas);
  } catch (error) {
    console.error("Error creating canvas:", error);
    return NextResponse.json(
      { message: "Failed to create canvas" },
      { status: 500 }
    );
  }
}

