import { NextResponse } from "next/server";
import { updateCanvasSchema } from "@/shared/schema";
import { neo4jStorage } from "@/app/api/services/neo4j-storage";

type PagePUTProps = {
  params: Promise<{
    canvasId: string;
  }>;
};
export async function PUT(
  req: Request,
  { params }: PagePUTProps
) {
  try {
    const body = await req.json();
    const updates = updateCanvasSchema.parse(body);
    const paramsObject = await params;
    const canvasId = paramsObject.canvasId;

    // Check if canvas exists
    const existingCanvas = await neo4jStorage.getCanvas(canvasId);
    if (!existingCanvas) {
      return NextResponse.json(
        { message: "Canvas not found" },
        { status: 404 }
      );
    }

    // Update the canvas
    const updatedCanvas = await neo4jStorage.updateCanvas(canvasId, updates);

    if (!updatedCanvas) {
      return NextResponse.json(
        { message: "Failed to update canvas" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCanvas);
  } catch (error) {
    console.error("Error updating canvas:", error);
    return NextResponse.json(
      { message: "Failed to update canvas" },
      { status: 500 }
    );
  }
}
type PageProps = {
  params: Promise<{
    canvasId: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: PageProps
) {
  try {
    const paramsObject = await params;
    const canvasId = paramsObject.canvasId;

    const canvas = await neo4jStorage.getCanvas(canvasId);
    if (!canvas) {
      return NextResponse.json(
        { message: "Canvas not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(canvas);
  } catch (error) {
    console.error("Error getting canvas:", error);
    return NextResponse.json(
      { message: "Failed to get canvas" },
      { status: 500 }
    );
  }
}
