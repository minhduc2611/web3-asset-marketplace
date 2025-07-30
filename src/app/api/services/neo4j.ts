import neo4j, { Session } from "neo4j-driver";
import driver from "@/lib/neo4j";

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export function getSession(): Session {
  return driver.session({
    // Use READ/WRITE database by default
    defaultAccessMode: neo4j.session.WRITE,
  });
}

// Thread-safe initialization
export async function initializeNeo4j(): Promise<void> {
  // Return existing promise if initialization is already in progress
  if (initializationPromise) {
    return initializationPromise;
  }

  // Skip if already initialized
  if (isInitialized) {
    return;
  }

  // Create initialization promise
  initializationPromise = performInitialization();

  try {
    await initializationPromise;
    isInitialized = true;
  } catch (error) {
    // Reset promise on failure so it can be retried
    initializationPromise = null;
    throw error;
  }
}

async function performInitialization(): Promise<void> {
  const session = getSession();

  try {
    console.log("Initializing Neo4j constraints and indexes...");

    // Create constraints
    await session.run(`
      CREATE CONSTRAINT topic_id_unique IF NOT EXISTS
      FOR (t:Topic) REQUIRE t.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT canvas_id_unique IF NOT EXISTS
      FOR (c:Canvas) REQUIRE c.id IS UNIQUE
    `);

    // Create indexes
    await session.run(`
      CREATE INDEX topic_name_index IF NOT EXISTS
      FOR (t:Topic) ON (t.name)
    `);

    await session.run(`
      CREATE INDEX canvas_author_index IF NOT EXISTS
      FOR (c:Canvas) ON (c.authorId)
    `);

    console.log("Neo4j constraints and indexes initialized successfully");
  } catch (error) {
    console.error("Error initializing Neo4j:", error);
    throw error;
  } finally {
    await session.close();
  }
}

// Health check function
export async function checkNeo4jHealth(): Promise<{
  status: string;
  details?: string;
}> {
  try {
    const session = getSession();

    try {
      await session.run("RETURN 1");
      return { status: "healthy" };
    } finally {
      await session.close();
    }
  } catch (error) {
    return {
      status: "unhealthy",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
