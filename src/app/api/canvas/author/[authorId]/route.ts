import { NextRequest, NextResponse } from "next/server";
import { neo4jStorage } from "@/app/api/services/neo4j-storage";

// api/canvas/author/9dde1fd0-371f-4028-a0f5-f32bb0cbc755
// api/canvas/author/9dde1fd0-371f-4028-a0f5-f32bb0cbc755
export async function GET(
  req: NextRequest,
  { params }: { params: { authorId: string } }
) {
  try {
    const paramsObject = await params;
    const authorId = paramsObject.authorId;
    console.log("authorId", authorId);

    // if (canvasId) {
    // const canvas = await neo4jStorage.getCanvas("9dde1fd0-371f-4028-a0f5-f32bb0cbc755");
    // if (!canvas) {
    //   return NextResponse.json(
    //     { message: "Canvas not found" },
    //     { status: 404 }
    //   );
    // }
    // return NextResponse.json(canvas);
    // }

    if (authorId) {
      const canvases = await neo4jStorage.getCanvasesByAuthor(authorId);
      return NextResponse.json(canvases);
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
