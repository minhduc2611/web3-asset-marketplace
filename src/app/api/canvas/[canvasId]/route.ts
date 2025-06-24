import { NextRequest, NextResponse } from "next/server";
import { neo4jStorage } from "@/app/api/services/neo4j-storage";
type PageProps = {
  params: Promise<{
    canvasId: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: PageProps
) {
  try {
    const paramsObject = await params;
    const canvasId = paramsObject.canvasId;
    console.log("canvasId", canvasId);

    if (canvasId) {
      const canvas = await neo4jStorage.getCanvas(canvasId);
      if (!canvas) {
        return NextResponse.json(
          { message: "Canvas not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(canvas);
    }

    return NextResponse.json(
      { message: "Missing required parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching canvas:", error);
    return NextResponse.json(
      { message: "Failed to fetch canvas" },
      { status: 500 }
    );
  }
}
