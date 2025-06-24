import { 
  topics, 
  relationships,
  type Topic, 
  type InsertTopic, 
  type Relationship, 
  type InsertRelationship,
  type GraphNode,
  type GraphEdge 
} from "@/shared/schema";

export interface IStorage {
  // Topic operations
  createTopic(topic: InsertTopic): Promise<Topic>;
  getTopicByName(name: string): Promise<Topic | undefined>;
  getAllTopics(): Promise<Topic[]>;
  deleteTopic(id: number): Promise<void>;
  
  // Relationship operations
  createRelationship(relationship: InsertRelationship): Promise<Relationship>;
  getRelationshipsBySourceId(sourceId: number): Promise<Relationship[]>;
  getAllRelationships(): Promise<Relationship[]>;
  deleteRelationshipsByTopicId(topicId: number): Promise<void>;
  
  // Graph operations
  getGraphData(): Promise<{ nodes: GraphNode[], edges: GraphEdge[] }>;
}

export class MemStorage implements IStorage {
  private topics: Map<number, Topic>;
  private relationships: Map<number, Relationship>;
  private topicIdCounter: number;
  private relationshipIdCounter: number;

  constructor() {
    this.topics = new Map();
    this.relationships = new Map();
    this.topicIdCounter = 1;
    this.relationshipIdCounter = 1;
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.topicIdCounter++;
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }

  async getTopicByName(name: string): Promise<Topic | undefined> {
    return Array.from(this.topics.values()).find(
      (topic) => topic.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async deleteTopic(id: number): Promise<void> {
    this.topics.delete(id);
  }

  async createRelationship(insertRelationship: InsertRelationship): Promise<Relationship> {
    const id = this.relationshipIdCounter++;
    const relationship: Relationship = { 
      id,
      sourceId: insertRelationship.sourceId!,
      targetId: insertRelationship.targetId!
    };
    this.relationships.set(id, relationship);
    return relationship;
  }

  async getRelationshipsBySourceId(sourceId: number): Promise<Relationship[]> {
    return Array.from(this.relationships.values()).filter(
      (rel) => rel.sourceId === sourceId
    );
  }

  async getAllRelationships(): Promise<Relationship[]> {
    return Array.from(this.relationships.values());
  }

  async deleteRelationshipsByTopicId(topicId: number): Promise<void> {
    const toDelete = Array.from(this.relationships.entries()).filter(
      ([_, rel]) => rel.sourceId === topicId || rel.targetId === topicId
    );
    
    toDelete.forEach(([id, _]) => {
      this.relationships.delete(id);
    });
  }

  async getGraphData(): Promise<{ nodes: GraphNode[], edges: GraphEdge[] }> {
    const allTopics = await this.getAllTopics();
    const allRelationships = await this.getAllRelationships();

    const nodes: GraphNode[] = allTopics.map(topic => ({
      id: `node-${topic.id}`,
      name: topic.name,
      type: topic.type as 'original' | 'generated'
    }));

    const edges: GraphEdge[] = allRelationships.map(rel => ({
      id: `edge-${rel.id}`,
      source: `node-${rel.sourceId}`,
      target: `node-${rel.targetId}`
    }));

    return { nodes, edges };
  }
}

export const storage = new MemStorage();
