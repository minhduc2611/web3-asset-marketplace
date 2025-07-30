import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';
    
    console.log('Neo4j Connection Configuration:');
    console.log(`- URI: ${uri}`);
    console.log(`- User: ${user}`);
    console.log(`- Password: ****`);
    
    try {
      driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
        // Connection pool configuration
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 60000, // 60 seconds
        maxTransactionRetryTime: 30000, // 30 seconds
        connectionTimeout: 30000, // 30 seconds
        disableLosslessIntegers: true,
        
        // Additional production settings
        encrypted: uri.startsWith('neo4j+s://') ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF',
        trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES',
        
        // Logging for debugging
        logging: {
          level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
          logger: (level: string, message: string) => {
            if (level === 'error') {
              console.error(`Neo4j [${level}]:`, message);
            } else if (process.env.NODE_ENV !== 'production') {
              console.log(`Neo4j [${level}]:`, message);
            }
          }
        }
      });
      
      console.log('Neo4j driver initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Neo4j driver:', error);
      throw error;
    }
  }
  return driver;
}

export function getSession(): Session {
  return getDriver().session({
    // Use READ/WRITE database by default
    defaultAccessMode: neo4j.session.WRITE
  });
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
    isInitialized = false;
    initializationPromise = null;
  }
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
    console.log('Initializing Neo4j constraints and indexes...');
    
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

    console.log('Neo4j constraints and indexes initialized successfully');
  } catch (error) {
    console.error('Error initializing Neo4j:', error);
    throw error;
  } finally {
    await session.close();
  }
}

// Health check function
export async function checkNeo4jHealth(): Promise<{ status: string; details?: string }> {
  try {
    const driver = getDriver();
    const session = driver.session();
    
    try {
      await session.run('RETURN 1');
      return { status: 'healthy' };
    } finally {
      await session.close();
    }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}