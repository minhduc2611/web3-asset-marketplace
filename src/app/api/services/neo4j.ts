import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';
    try {
      driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
      console.log('Neo4j driver initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Neo4j driver:', error);
      throw error;
    }
  }
  return driver;
}

export function getSession(): Session {
  return getDriver().session();
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

// Initialize Neo4j constraints and indexes
export async function initializeNeo4j(): Promise<void> {
  const session = getSession();
  
  try {
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

    console.log('Neo4j constraints and indexes initialized');
  } catch (error) {
    console.error('Error initializing Neo4j:', error);
  } finally {
    await session.close();
  }
}