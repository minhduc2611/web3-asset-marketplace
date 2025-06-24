import { NextRequest, NextResponse } from 'next/server';
import { neo4jStorage } from '@/app/api/services/neo4j-storage';

type PageProps = {
  params: Promise<{
    nodeId: string;
  }>;
};

export async function DELETE(req: NextRequest, { params }: PageProps) {
  try {
    const paramsObject = await params;
    const nodeId = paramsObject.nodeId;

    if (!nodeId) {
      return NextResponse.json(
        { message: "Node ID is required" },
        { status: 400 }
      );
    }

    // Delete relationships first
    await neo4jStorage.deleteRelationshipsByTopicId(nodeId);

    // Delete the topic
    await neo4jStorage.deleteTopic(nodeId);

    return NextResponse.json({
      message: "Successfully deleted node",
    });
  } catch (error) {
    console.error("Error deleting node:", error);
    return NextResponse.json(
      { message: "Failed to delete node" },
      { status: 500 }
    );
  }
}

type PagePropsPUT = {
  params: Promise<{
    nodeId: string;
  }>;
};

export async function PUT(req: NextRequest, { params }: PagePropsPUT) {
  try {
    const paramsObject = await params;
    const nodeId = paramsObject.nodeId;

    if (!nodeId) {
      return NextResponse.json(
        { message: "Node ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description, knowledge } = body;

    const updates: { name?: string; description?: string; knowledge?: string } =
      {};

    if (name !== undefined) {
      if (name.trim() === "") {
        return NextResponse.json(
          { message: "Name cannot be empty" },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (description !== undefined) updates.description = description;
    if (knowledge !== undefined) updates.knowledge = knowledge;

    const updatedTopic = await neo4jStorage.updateTopic(nodeId, updates);

    if (!updatedTopic) {
      return NextResponse.json({ message: "Node not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedTopic.id,
      name: updatedTopic.name,
      description: updatedTopic.description,
      knowledge: updatedTopic.knowledge,
      type: updatedTopic.type,
    });
  } catch (error) {
    console.error("Error updating node:", error);
    return NextResponse.json(
      { message: "Failed to update node" },
      { status: 500 }
    );
  }
}
