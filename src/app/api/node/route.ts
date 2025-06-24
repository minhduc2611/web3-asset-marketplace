import { NextRequest, NextResponse } from "next/server";
import { createNodeSchema, InsertTopic } from "@/shared/schema";
import { neo4jStorage } from "@/app/api/services/neo4j-storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, canvasId, parentNodeId, description } =
      createNodeSchema.parse(body);

    // Check if canvas exists
    const canvas = await neo4jStorage.getCanvas(canvasId);
    if (!canvas) {
      return NextResponse.json(
        { message: "Canvas not found" },
        { status: 404 }
      );
    }

    // Check if topic already exists
    const existingTopic = await neo4jStorage.getTopicByName(name, canvasId);
    if (existingTopic) {
      return NextResponse.json(
        { message: "Topic already exists in this canvas" },
        { status: 409 }
      );
    }

    const payload: Omit<InsertTopic, "id"> = {
      name: name,
      canvasId,
      type: parentNodeId ? "generated" : "original",
    };

    if (description) {
      payload.description = description;
    }

    // Create new topic
    const newTopic = await neo4jStorage.createTopic(payload);

    // Create relationship if parent node is specified
    if (parentNodeId) {
      await neo4jStorage.createRelationship({
        sourceId: parentNodeId,
        targetId: newTopic.id,
        canvasId,
      });
    }

    return NextResponse.json({
      id: newTopic.id,
      name: newTopic.name,
      type: newTopic.type,
    });
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { message: "Failed to create node" },
      { status: 500 }
    );
  }
}
