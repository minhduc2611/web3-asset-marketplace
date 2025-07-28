import { NextResponse } from "next/server";
import {
  generateKeywordsSchema,
  type GenerateKeywordsResponse,
} from "@/shared/schema";
import { neo4jStorage } from "@/app/api/services/neo4j-storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name: topicName,
      canvasId,
      nodeCount = 3,
      isAutomatic = false,
    } = generateKeywordsSchema.parse(body);

    // Check if canvas exists
    const canvas = await neo4jStorage.getCanvas(canvasId);
    if (!canvas) {
      return NextResponse.json(
        { message: "Canvas not found" },
        { status: 404 }
      );
    }

    // 1. Fetch the source topic node to get its ID
    const sourceTopic = await neo4jStorage.getTopicByName(topicName, canvasId);
    if (!sourceTopic) {
      return NextResponse.json(
        { message: "Source topic not found" },
        { status: 404 }
      );
    }

    // 2. Get the hierarchical path, existing siblings, and children for context
    const topicPath = await neo4jStorage.getTopicPath(sourceTopic.id, canvasId);
    const existingSiblings = await neo4jStorage.getExistingSiblings(
      sourceTopic.id,
      canvasId
    );
    const topicChildren = await neo4jStorage.getTopicChildren(
      sourceTopic.id,
      canvasId
    );

    // 3. Call OpenAI with the new, more detailed prompt
    const systemInstructionSection = canvas.systemInstruction
      ? `<system-instruction>
${canvas.systemInstruction}
</system-instruction>`
      : "";

    const instructions = `
<persona>
You are an expert in curriculum design and knowledge architecture. Your task is to generate keywords for a knowledge map to help a user learn a topic systematically.
You will be given a 'topic', its hierarchical 'topicPath', existing 'children' (if any), a list of 'existingSiblings' to avoid, and ${
      isAutomatic
        ? "you should determine the optimal number of keywords (maximum 15)"
        : "the desired 'nodeCount'"
    }.
</persona>
${systemInstructionSection}
<task-description>
  Your generated keywords MUST follow these rules:
  <hierarchical-specificity>
    The specificity of your keywords must adapt to the depth of the 'topicPath'.
    * Shallow Path (1-2 levels deep): Generate broader, foundational sub-topics.
    * Deep Path (3+ levels deep): Generate more specific, niche concepts, applications, or tools.  
  </hierarchical-specificity>
  <content-rich-mix>
    Provide a mix of core concepts, practical applications, and emerging trends.
  </content-rich-mix>
  <avoid-redundancy>
    Do not repeat the 'topic' itself, any keywords from the 'existingSiblings' list, or any existing 'children'.
  </avoid-redundancy>
  <children-awareness>
    If the topic already has children, consider the gaps or complementary areas that haven't been covered yet.
  </children-awareness>
  ${
    isAutomatic
      ? `<automatic-count>
    Since this is automatic mode, determine the optimal number of keywords based on:
    * Topic complexity and breadth
    * Depth in the learning hierarchy
    * Existing siblings count
    * Generate between 3-15 keywords as appropriate, prioritizing quality over quantity
  </automatic-count>`
      : ""
  }
</task-description>
<format>
  Respond ONLY with a valid JSON object in the format
  <example>
    { "keywords": ["Competitive Landscape Assessment", "Key SaaS Market Metrics", "Target Customer Segmentation"] }
  </example>
  <example>
    { "keywords": ["keyword1", "keyword2", ...] }
  </example>
</format>
`;
    const automaticInstructions = isAutomatic
      ? "- Mode: Automatic (generate an optimal number of keywords, maximum 15, based on the topic complexity and depth)"
      : `- Node Count: ${nodeCount}`;

    const childrenSection = topicChildren.length > 0 
      ? `- Children: [${topicChildren.map((c) => `"${c}"`).join(", ")}]`
      : "";

    const input = `
- Topic: "${topicName}"
- Topic Path: [${topicPath.map((p) => `"${p}"`).join(", ")}]
${childrenSection ? childrenSection + '\n' : ''}- Existing Siblings: [${
      existingSiblings.length > 0
        ? existingSiblings.map((s) => `"${s}"`).join(", ")
        : ""
    }]
${automaticInstructions}
`;
    const response = await openai.responses.create({
      model: "gpt-4.1",
      tools: [{ type: "web_search_preview" }],
      input,
      instructions,
      max_output_tokens: 400,
    });

    const aiResult = JSON.parse(response.output_text || "{}");
    const keywords = aiResult.keywords || [];

    if (!Array.isArray(keywords) || keywords.length === 0) {
      // It's better to return an empty array than to throw an error if AI returns nothing
      return NextResponse.json({ keywords: [], edges: [] });
    }

    // 4. Create new nodes and relationships (your existing logic is good here)
    const newNodes = [];
    const newEdges = [];

    for (const keyword of keywords) {
      let keywordTopic = await neo4jStorage.getTopicByName(keyword, canvasId);

      if (!keywordTopic) {
        keywordTopic = await neo4jStorage.createTopic({
          name: keyword,
          canvasId,
          type: "generated",
        });
      }

      newNodes.push({
        id: keywordTopic.id,
        name: keywordTopic.name,
        type: keywordTopic.type as "original" | "generated",
      });

      const relationshipExists = await neo4jStorage.relationshipExists(
        sourceTopic.id,
        keywordTopic.id
      );

      if (!relationshipExists) {
        const relationship = await neo4jStorage.createRelationship({
          canvasId,
          sourceId: sourceTopic.id,
          targetId: keywordTopic.id,
        });

        newEdges.push({
          id: relationship.id,
          source: sourceTopic.id,
          target: keywordTopic.id,
        });
      }
    }

    const result: GenerateKeywordsResponse = {
      keywords: newNodes,
      edges: newEdges,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating keywords:", error);
    return NextResponse.json(
      { message: "Failed to generate keywords. Please try again." },
      { status: 500 }
    );
  }
}
