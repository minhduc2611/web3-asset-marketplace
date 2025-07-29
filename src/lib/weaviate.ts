// NOTE: This is a basic Weaviate integration template
// You'll need to configure this based on your specific Weaviate setup
// Refer to: https://weaviate.io/developers/weaviate/client-libraries/typescript

import weaviate, { vectors } from "weaviate-client";
import type { WeaviateClient } from "weaviate-client";

if (!process.env.WEAVIATE_URL) {
  throw new Error("WEAVIATE_URL environment variable is required");
}
if (!process.env.WEAVIATE_API_KEY) {
  throw new Error("WEAVIATE_API_KEY environment variable is required");
}

// Document chunk collection name
export const CHUNK_COLLECTION_NAME = "DocumentChunk";

// Optional: Add API key if using Weaviate Cloud or auth-enabled instance
// if (!process.env.WEAVIATE_API_KEY) {
//   throw new Error('WEAVIATE_API_KEY environment variable is required');
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: WeaviateClient; // Using any for now - replace with proper types based on your setup

export const initWeaviateClient = async () => {
  client = await weaviate.connectToWeaviateCloud(
    process.env.WEAVIATE_URL as string,
    {
      authCredentials: new weaviate.ApiKey(
        process.env.WEAVIATE_API_KEY as string
      ),
      headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY as string },
    }
  );

  // Create collection
  const collection = client.collections.get(CHUNK_COLLECTION_NAME);

  // Check if collection exists
  const collectionExists = await collection.exists();
  if (!collectionExists) {
    // Create collection
    await client.collections.create({
      name: CHUNK_COLLECTION_NAME,
      vectorizers: vectors.text2VecOpenAI({
        model: "text-embedding-3-small",
      }),
    });
  }
};

initWeaviateClient();

export const getWeaviateClient = async () => {
  if (!client) {
    // For local Weaviate instance (adjust based on your setup):

    client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL as string, // Your Weaviate Cloud URL
      {
        authCredentials: new weaviate.ApiKey(
          process.env.WEAVIATE_API_KEY as string
        ), // Your API key
        // Optionally, add headers for inference APIs:
        headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY as string },
      }
    );

    // Example: check if the client is ready
    const isReady = await client.isReady();
    console.log(isReady); // Should print: true

    // client.close(); // Close the client connection when done

    // For Weaviate Cloud (uncomment and adjust):
    // client = await weaviate.connectToWeaviateCloud(process.env.WEAVIATE_URL!, {
    //   apiKey: process.env.WEAVIATE_API_KEY!,
    // });
  }
  return client;
};

export interface ChunkData {
  id: string;
  name: string;
  description: string;
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface DocumentChunksData {
  canvasId: string;
  filename: string;
  originalText: string;
  chunks: ChunkData[];
  metadata: {
    totalChunks: number;
    totalCharacters: number;
    createdAt: string;
  };
}

// Save chunks to Weaviate
export const saveChunksToWeaviate = async (
  data: DocumentChunksData
): Promise<void> => {
  const client = await getWeaviateClient();

  try {
    // Get or create collection
    const collection = client.collections.get(CHUNK_COLLECTION_NAME);

    // Prepare data objects for insertion
    const dataObjects = data.chunks.map((chunk) => ({
      properties: {
        filename: data.filename,
        chunkId: chunk.id,
        name: chunk.name,
        description: chunk.description,
        text: chunk.text,
        startIndex: chunk.startIndex,
        endIndex: chunk.endIndex,
        totalChunks: data.metadata.totalChunks,
        totalCharacters: data.metadata.totalCharacters,
        createdAt: data.metadata.createdAt,
        canvasId: data.canvasId,
      },
    }));

    // Use insertMany for batch insertion
    const result = await collection.data.insertMany(dataObjects);

    // Check for errors in the result
    if (result.hasErrors) {
      console.error("Some objects failed to insert:", result.errors);
      throw new Error(
        `Failed to insert ${Object.keys(result.errors).length} out of ${
          data.chunks.length
        } chunks`
      );
    }

    console.log(`Successfully saved ${data.chunks.length} chunks to Weaviate`);
  } catch (error) {
    console.error("Error saving chunks to Weaviate:", error);
    throw error;
  }
};

// Search chunks by canvas ID and query
export interface SearchResult {
  id: string;
  filename: string;
  chunkId: string;
  name: string;
  description: string;
  text: string;
  startIndex: number;
  endIndex: number;
  score: number;
}

export const searchChunksByCanvas = async (
  query: string,
  canvasId: string,
  limit: number = 5
): Promise<SearchResult[]> => {
  const client = await getWeaviateClient();

  try {
    const collection = client.collections.get(CHUNK_COLLECTION_NAME);

    // Perform semantic search with canvas ID filter
    const result = await collection.query.nearText(query, {
      limit,
      returnMetadata: ['score'],
      filters: collection.filter.byProperty('canvasId').equal(canvasId),
    });

    // Transform results to our interface
    const searchResults: SearchResult[] = result.objects.map((obj) => ({
      id: obj.uuid,
      filename: obj.properties.filename as string,
      chunkId: obj.properties.chunkId as string,
      name: obj.properties.name as string,
      description: obj.properties.description as string,
      text: obj.properties.text as string,
      startIndex: obj.properties.startIndex as number,
      endIndex: obj.properties.endIndex as number,
      score: obj.metadata?.score || 0,
    }));

    return searchResults;
  } catch (error) {
    console.error("Error searching chunks in Weaviate:", error);
    // Return empty array instead of throwing to not break the keyword generation
    return [];
  }
};
