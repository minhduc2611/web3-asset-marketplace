import neo4j from "neo4j-driver";

const uri = process.env.NEO4J_URI || "bolt://localhost:7687";
const user = process.env.NEO4J_USER || "neo4j";
const password = process.env.NEO4J_PASSWORD || "password";

console.log("Neo4j Connection Configuration:");
console.log(`- URI: ${uri}`);
console.log(`- User: ${user}`);
console.log(`- Password: ****`);

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  // Connection pool configuration
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeout: 60000, // 60 seconds
  maxTransactionRetryTime: 30000, // 30 seconds
  connectionTimeout: 30000, // 30 seconds
  disableLosslessIntegers: true,
});

console.log("Neo4j driver initialized successfully");
 
export default driver;