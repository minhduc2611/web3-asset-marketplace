// import type { Express } from "express";
// import { createServer, type Server } from "http";
// import { neo4jStorage } from "./neo4j-storage";
// import { initializeNeo4j, getSession } from "./neo4j";
// import { 
//   createCanvasSchema,
//   createNodeSchema, 
//   generateKeywordsSchema,
//   type CreateCanvasRequest,
//   type CreateNodeRequest,
//   type GenerateKeywordsRequest,
//   type GenerateKeywordsResponse 
// } from "@shared/schema";
// import OpenAI from "openai";
// import { v4 as uuidv4 } from 'uuid';

// const openai = new OpenAI({ 
//   apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
// });

// export async function registerRoutes(app: Express): Promise<Server> {
//   // Initialize Neo4j
//   await initializeNeo4j();
  
//   // Create a new canvas
//   app.post("/api/canvas", async (req, res) => {
//     try {
//       const { name, authorId } = createCanvasSchema.parse(req.body);
      
//       const newCanvas = await neo4jStorage.createCanvas({
//         name,
//         authorId
//       });

//       res.json(newCanvas);

//     } catch (error) {
//       console.error("Error creating canvas:", error);
//       res.status(500).json({ 
//         message: "Failed to create canvas" 
//       });
//     }
//   });

//   // Get canvas by ID
//   app.get("/api/canvas/:canvasId", async (req, res) => {
//     try {
//       const canvasId = req.params.canvasId;
//       const canvas = await neo4jStorage.getCanvas(canvasId);
      
//       if (!canvas) {
//         return res.status(404).json({ 
//           message: "Canvas not found" 
//         });
//       }

//       res.json(canvas);

//     } catch (error) {
//       console.error("Error fetching canvas:", error);
//       res.status(500).json({ 
//         message: "Failed to fetch canvas" 
//       });
//     }
//   });

//   // Get canvases by author
//   app.get("/api/canvas/author/:authorId", async (req, res) => {
//     try {
//       const authorId = req.params.authorId;
//       const canvases = await neo4jStorage.getCanvasesByAuthor(authorId);
      
//       res.json(canvases);

//     } catch (error) {
//       console.error("Error fetching canvases:", error);
//       res.status(500).json({ 
//         message: "Failed to fetch canvases" 
//       });
//     }
//   });

//   // Create a new node (including sub nodes)
//   app.post("/api/node", async (req, res) => {
//     try {
//       const { name, description, canvasId, parentNodeId } = req.body;
      
//       if (!name || !canvasId) {
//         return res.status(400).json({ 
//           message: "Name and canvasId are required" 
//         });
//       }
      
//       // Check if canvas exists
//       const canvas = await neo4jStorage.getCanvas(canvasId);
//       if (!canvas) {
//         return res.status(404).json({ 
//           message: "Canvas not found" 
//         });
//       }
      
//       // Create new topic
//       const newTopic = await neo4jStorage.createTopic({
//         name: name.trim(),
//         canvasId,
//         type: "generated",
//         description: description || ""
//       });

//       // Create relationship if parent node is specified
//       if (parentNodeId) {
//         await neo4jStorage.createRelationship({
//           sourceId: parentNodeId,
//           targetId: newTopic.id,
//           canvasId
//         });
//       }

//       res.json({
//         id: newTopic.id,
//         name: newTopic.name,
//         type: newTopic.type,
//         description: newTopic.description || ""
//       });

//     } catch (error) {
//       console.error("Error creating node:", error);
//       res.status(500).json({ 
//         message: "Failed to create node" 
//       });
//     }
//   });
  
//   // Create a new topic node
//   app.post("/api/create-node", async (req, res) => {
//     try {
//       const { topic, canvasId } = createNodeSchema.parse(req.body);
      
//       // Check if canvas exists
//       const canvas = await neo4jStorage.getCanvas(canvasId);
//       if (!canvas) {
//         return res.status(404).json({ 
//           message: "Canvas not found" 
//         });
//       }
      
//       // Check if topic already exists in this canvas
//       const existingTopic = await neo4jStorage.getTopicByName(topic, canvasId);
//       if (existingTopic) {
//         return res.status(409).json({ 
//           message: "Topic already exists in this canvas" 
//         });
//       }

//       // Create new topic
//       const newTopic = await neo4jStorage.createTopic({
//         name: topic,
//         canvasId,
//         type: "original"
//       });

//       res.json({
//         id: newTopic.id,
//         name: newTopic.name,
//         type: newTopic.type
//       });

//     } catch (error) {
//       console.error("Error creating node:", error);
//       res.status(500).json({ 
//         message: "Failed to create node" 
//       });
//     }
//   });

//   // Generate keywords for a topic using OpenAI
//   app.post("/api/generate-keywords", async (req, res) => {
//     try {
//       const { topic, canvasId, nodeCount = 3 } = generateKeywordsSchema.parse(req.body);
      
//       // Check if canvas exists
//       const canvas = await neo4jStorage.getCanvas(canvasId);
//       if (!canvas) {
//         return res.status(404).json({ 
//           message: "Canvas not found" 
//         });
//       }
      
//       // Find the source topic
//       const sourceTopic = await neo4jStorage.getTopicByName(topic, canvasId);
//       if (!sourceTopic) {
//         return res.status(404).json({ 
//           message: "Source topic not found" 
//         });
//       }

//       // Get all existing topics in the canvas for context
//       const existingTopics = await neo4jStorage.getTopicsByCanvas(canvasId);
//       const existingNodeTitles = existingTopics.map(t => t.name);

//       // Call OpenAI to generate keywords
//       // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
//       const response = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content: `You are an expert knowledge mapper creating insightful keyword connections. Generate exactly ${nodeCount} related keywords/subtopics that:

// 1. Are directly relevant to the given topic
// 2. Show about 50% overlap with existing concepts (not exact duplicates, but related/connected themes)
// 3. Add new insights while maintaining thematic coherence
// 4. Help build a comprehensive knowledge map

// Context - Existing nodes in this knowledge map: ${existingNodeTitles.length > 0 ? existingNodeTitles.join(', ') : 'None yet'}

// Respond with JSON in this format: { "keywords": [${Array(nodeCount).fill(0).map((_, i) => `"keyword${i+1}"`).join(', ')}] }`
//           },
//           {
//             role: "user",
//             content: `Generate ${nodeCount} insightful keywords/subtopics for: "${topic}"

// Consider the existing context and create keywords that are:
// - Conceptually related to "${topic}"
// - About 50% overlapping with existing themes but not exact duplicates
// - Adding valuable new dimensions to the knowledge map`
//           }
//         ],
//         response_format: { type: "json_object" },
//         max_tokens: 300
//       });

//       const aiResult = JSON.parse(response.choices[0].message.content || "{}");
//       const keywords = aiResult.keywords || [];

//       if (!Array.isArray(keywords) || keywords.length !== nodeCount) {
//         throw new Error("Invalid response from OpenAI");
//       }

//       // Create keyword nodes and relationships
//       const newNodes = [];
//       const newEdges = [];

//       for (const keyword of keywords) {
//         let keywordTopic = await neo4jStorage.getTopicByName(keyword, canvasId);
        
//         // Create keyword node if it doesn't exist
//         if (!keywordTopic) {
//           keywordTopic = await neo4jStorage.createTopic({
//             name: keyword,
//             canvasId,
//             type: "generated"
//           });
//         }

//         newNodes.push({
//           id: keywordTopic.id,
//           name: keywordTopic.name,
//           type: keywordTopic.type as 'original' | 'generated'
//         });

//         // Create relationship if it doesn't exist
//         const existingRelationships = await neo4jStorage.getRelationshipsByCanvas(canvasId);
//         const relationshipExists = existingRelationships.some(
//           (rel: any) => rel.sourceId === sourceTopic.id && rel.targetId === keywordTopic!.id
//         );

//         if (!relationshipExists) {
//           const relationship = await neo4jStorage.createRelationship({
//             canvasId,
//             sourceId: sourceTopic.id,
//             targetId: keywordTopic.id
//           });

//           newEdges.push({
//             id: relationship.id,
//             source: sourceTopic.id,
//             target: keywordTopic.id
//           });
//         }
//       }

//       const result: GenerateKeywordsResponse = {
//         keywords: newNodes,
//         edges: newEdges
//       };

//       res.json(result);

//     } catch (error) {
//       console.error("Error generating keywords:", error);
//       res.status(500).json({ 
//         message: "Failed to generate keywords. Please try again." 
//       });
//     }
//   });

//   // Get all graph data for a canvas
//   app.get("/api/canvas/graph-data/:canvasId", async (req, res) => {
//     try {
//       const canvasId = req.params.canvasId;
      
//       // Check if canvas exists
//       const canvas = await neo4jStorage.getCanvas(canvasId);
//       if (!canvas) {
//         return res.status(404).json({ 
//           message: "Canvas not found" 
//         });
//       }
      
//       const graphData = await neo4jStorage.getGraphData(canvasId);
//       res.json(graphData);
//     } catch (error) {
//       console.error("Error fetching graph data:", error);
//       res.status(500).json({ 
//         message: "Failed to fetch graph data" 
//       });
//     }
//   });

//   // Delete a node and its relationships
//   app.delete("/api/node/:nodeId", async (req, res) => {
//     try {
//       const nodeId = req.params.nodeId;
      
//       // Delete relationships first
//       await neo4jStorage.deleteRelationshipsByTopicId(nodeId);
      
//       // Delete the topic
//       await neo4jStorage.deleteTopic(nodeId);

//       res.json({ 
//         message: `Successfully deleted node` 
//       });

//     } catch (error) {
//       console.error("Error deleting node:", error);
//       res.status(500).json({ 
//         message: "Failed to delete node" 
//       });
//     }
//   });



//   // Update a node's title and metadata
//   app.put("/api/node/:nodeId", async (req, res) => {
//     try {
//       const nodeId = req.params.nodeId;
//       const { name, description, knowledge } = req.body;
      
//       // Build update object with only provided fields
//       const updates: { name?: string; description?: string; knowledge?: string } = {};
      
//       if (name !== undefined) {
//         if (name.trim() === "") {
//           return res.status(400).json({ 
//             message: "Name cannot be empty" 
//           });
//         }
//         updates.name = name.trim();
//       }
      
//       if (description !== undefined) {
//         updates.description = description;
//       }
      
//       if (knowledge !== undefined) {
//         updates.knowledge = knowledge;
//       }

//       // Update the topic in Neo4j
//       const updatedTopic = await neo4jStorage.updateTopic(nodeId, updates);

//       if (!updatedTopic) {
//         return res.status(404).json({ 
//           message: "Node not found" 
//         });
//       }

//       res.json({
//         id: updatedTopic.id,
//         name: updatedTopic.name,
//         description: updatedTopic.description,
//         knowledge: updatedTopic.knowledge,
//         type: updatedTopic.type
//       });

//     } catch (error) {
//       console.error("Error updating node:", error);
//       res.status(500).json({ 
//         message: "Failed to update node" 
//       });
//     }
//   });

//   // Google search with Gemini AI integration
//   app.post("/api/google-search", async (req, res) => {
//     try {
//       const { query } = req.body;
      
//       if (!query || query.trim() === "") {
//         return res.status(400).json({ 
//           message: "Search query is required" 
//         });
//       }

//       // Use OpenAI to generate AI insights about the search query
//       // We'll use GPT-4 to simulate Gemini-like responses
//       const aiResponse = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content: `You are an AI assistant providing comprehensive insights and analysis. When given a search query, provide detailed, informative explanations that cover:
// 1. Key concepts and definitions
// 2. Important context and background
// 3. Related topics and connections
// 4. Practical applications or implications
// 5. Current trends or developments

// Provide accurate, well-structured information that would be valuable for someone researching this topic.`
//           },
//           {
//             role: "user",
//             content: `Provide comprehensive insights and analysis for: "${query}"`
//           }
//         ],
//         max_tokens: 1000,
//         temperature: 0.7
//       });

//       const geminiAnswer = aiResponse.choices[0].message.content || "";

//       // Mock Google search results for demonstration
//       // In a production environment, you would integrate with Google Custom Search API
//       const searchResults = [
//         {
//           title: `${query} - Wikipedia`,
//           link: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
//           snippet: `Learn about ${query} from the world's largest encyclopedia. Comprehensive information, history, and related topics.`,
//           displayLink: "en.wikipedia.org"
//         },
//         {
//           title: `${query} - Latest News and Updates`,
//           link: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
//           snippet: `Stay updated with the latest news and developments about ${query}. Real-time coverage from trusted sources.`,
//           displayLink: "news.google.com"
//         },
//         {
//           title: `Research and Analysis: ${query}`,
//           link: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
//           snippet: `Academic research and scholarly articles about ${query}. Peer-reviewed papers and scientific studies.`,
//           displayLink: "scholar.google.com"
//         },
//         {
//           title: `${query} - Complete Guide and Resources`,
//           link: `https://example.com/${encodeURIComponent(query)}`,
//           snippet: `Comprehensive guide covering everything you need to know about ${query}. Tutorials, tips, and expert insights.`,
//           displayLink: "example.com"
//         }
//       ];

//       res.json({
//         searchResults,
//         geminiAnswer
//       });

//     } catch (error) {
//       console.error("Error performing Google search:", error);
//       res.status(500).json({ 
//         message: "Failed to perform search. Please try again." 
//       });
//     }
//   });

//   const httpServer = createServer(app);
//   return httpServer;
// }
