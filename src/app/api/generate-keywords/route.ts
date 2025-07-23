import { NextResponse } from 'next/server';
import { generateKeywordsSchema, Relationship, type GenerateKeywordsResponse } from '@/shared/schema';
import { neo4jStorage } from '@/app/api/services/neo4j-storage';
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

export async function POST(req: Request) {
  try {
    console.log("req", req);
    const body = await req.json();
    console.log("body", body);
    const { name: topic, canvasId, nodeCount = 3 } = generateKeywordsSchema.parse(body);
    
    // Check if canvas exists
    const canvas = await neo4jStorage.getCanvas(canvasId);
    if (!canvas) {
      return NextResponse.json(
        { message: "Canvas not found" },
        { status: 404 }
      );
    }
    
    // Find the source topic
    const sourceTopic = await neo4jStorage.getTopicByName(topic, canvasId);
    if (!sourceTopic) {
      return NextResponse.json(
        { message: "Source topic not found" },
        { status: 404 }
      );
    }

    // Get all existing topics in the canvas for context
    const existingTopics = await neo4jStorage.getTopicsByCanvas(canvasId);
    const existingNodeTitles = existingTopics.map(t => t.name);

    // Call OpenAI to generate keywords
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
You are an expert knowledge mapper creating insightful keyword connections. Generate exactly ${nodeCount} related keywords/subtopics that:

1. Are directly relevant to the given topic
2. Show about 50% overlap with existing concepts (not exact duplicates, but related/connected themes)
3. Add new insights while maintaining thematic coherence
4. Help build a comprehensive knowledge map

Context - Existing nodes in this knowledge map: ${existingNodeTitles.length > 0 ? existingNodeTitles.join(', ') : 'None yet'}

Respond with JSON in this format: { "keywords": [${Array(nodeCount).fill(0).map((_, i) => `"keyword${i+1}"`).join(', ')}] }`
        },
        {
          role: "user",
          content: `Generate ${nodeCount} insightful keywords/subtopics for: "${topic}"

Consider the existing context and create keywords that are:
- Conceptually related to "${topic}"
- About 50% overlapping with existing themes but not exact duplicates
- Adding valuable new dimensions to the knowledge map`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300
    });

    const aiResult = JSON.parse(response.choices[0].message.content || "{}");
    const keywords = aiResult.keywords || [];

    if (!Array.isArray(keywords) || keywords.length !== nodeCount) {
      throw new Error("Invalid response from OpenAI");
    }

    // Create keyword nodes and relationships
    const newNodes = [];
    const newEdges = [];

    for (const keyword of keywords) {
      let keywordTopic = await neo4jStorage.getTopicByName(keyword, canvasId);
      
      // Create keyword node if it doesn't exist
      if (!keywordTopic) {
        keywordTopic = await neo4jStorage.createTopic({
          name: keyword,
          canvasId,
          type: "generated"
        });
      }

      newNodes.push({
        id: keywordTopic.id,
        name: keywordTopic.name,
        type: keywordTopic.type as 'original' | 'generated'
      });

      // Create relationship if it doesn't exist
      const existingRelationships = await neo4jStorage.getRelationshipsByCanvas(canvasId);
      const relationshipExists = existingRelationships.some(
        (rel: Relationship) => rel.sourceId === sourceTopic.id && rel.targetId === keywordTopic!.id
      );

      if (!relationshipExists) {
        const relationship = await neo4jStorage.createRelationship({
          canvasId,
          sourceId: sourceTopic.id,
          targetId: keywordTopic.id
        });

        newEdges.push({
          id: relationship.id,
          source: sourceTopic.id,
          target: keywordTopic.id
        });
      }
    }

    const result: GenerateKeywordsResponse = {
      keywords: newNodes,
      edges: newEdges
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