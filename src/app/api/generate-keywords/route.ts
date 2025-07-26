import { NextResponse } from "next/server";
import { generateKeywordsSchema, type GenerateKeywordsResponse } from "@/shared/schema";
import { neo4jStorage } from "@/app/api/services/neo4j-storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key",
});

export async function POST(req: Request) {
  try {
    console.log("req", req);
    const body = await req.json();
    console.log("body", body);
    const {
      name: topicName,
      canvasId,
      nodeCount = 3,
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

    // 2. Get the hierarchical path and existing siblings for context
    // You would replace `conceptualNeo4jStorage` with your actual `neo4jStorage` service
    const topicPath = await neo4jStorage.getTopicPath(sourceTopic.id, canvasId);
    const existingSiblings = await neo4jStorage.getExistingSiblings(
      sourceTopic.id,
      canvasId
    );

    // 3. Call OpenAI with the new, more detailed prompt
    const instructions = `
<persona>
You are an expert in curriculum design and knowledge architecture. Your task is to generate keywords for a knowledge map to help a user learn a topic systematically.
You will be given a 'topic', its hierarchical 'topicPath', a list of 'existingSiblings' to avoid, and the desired 'nodeCount'.
</persona>
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
    Do not repeat the 'topic' itself or any keywords from the 'existingSiblings' list.
  </avoid-redundancy>
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
    const input = `
- Topic: "${topicName}"
- Topic Path: [${topicPath.map((p) => `"${p}"`).join(", ")}]
- Existing Siblings: [${
      existingSiblings.length > 0
        ? existingSiblings.map((s) => `"${s}"`).join(", ")
        : ""
    }]
- Node Count: ${nodeCount}
`;
    const response = await openai.responses.create({
      model: "gpt-4.1",
      tools: [{ type: "web_search_preview" }],
      input,
      instructions,
      max_output_tokens: 400,
    });
    console.log("response", response);

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
