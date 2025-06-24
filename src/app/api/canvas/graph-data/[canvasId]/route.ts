import { NextRequest, NextResponse } from 'next/server';
import { neo4jStorage } from '@/app/api/services/neo4j-storage';

type PageProps = {
  params: Promise<{
    canvasId: string;
  }>;
};

export async function GET(req: NextRequest, { params }: PageProps) {
  try {
    const paramsObject = await params;
    const canvasId = paramsObject.canvasId;
    
    if (!canvasId) {
      return NextResponse.json(
        { message: "Canvas ID is required" },
        { status: 400 }
      );
    }
    
    // Check if canvas exists
    const canvas = await neo4jStorage.getCanvas(canvasId);
    if (!canvas) {
      return NextResponse.json(
        { message: "Canvas not found" },
        { status: 404 }
      );
    }
    
    const graphData = await neo4jStorage.getGraphData(canvasId);
    return NextResponse.json(graphData);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return NextResponse.json(
      { message: "Failed to fetch graph data" },
      { status: 500 }
    );
  }
} 