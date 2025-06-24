 
// TODO: fix this file
import {
  type Topic,
  type InsertTopic,
  type Relationship,
  type InsertRelationship,
  type GraphNode,
  type GraphEdge,
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
  getGraphData(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }>;
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
    const topic: Topic = {
      ...insertTopic,
      id: id.toString(),
      description: insertTopic.description || null,
      knowledge: insertTopic.knowledge || null,
      positionX: insertTopic.positionX || null,
      positionY: insertTopic.positionY || null,
      createdAt: insertTopic.createdAt || null,
    };
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

  async createRelationship(
    insertRelationship: InsertRelationship
  ): Promise<Relationship> {
    const id = this.relationshipIdCounter++;
    const relationship: Relationship = {
      id: id.toString(),
      sourceId: insertRelationship.sourceId!,
      targetId: insertRelationship.targetId!,
      canvasId: insertRelationship.canvasId!,
      createdAt: insertRelationship.createdAt || null,
    };
    this.relationships.set(id, relationship);
    return relationship;
  }

  async getRelationshipsBySourceId(sourceId: number): Promise<Relationship[]> {
    return Array.from(this.relationships.values()).filter(
      (rel) => rel.sourceId === String(sourceId)
    );
  }

  async getAllRelationships(): Promise<Relationship[]> {
    return Array.from(this.relationships.values());
  }

  async deleteRelationshipsByTopicId(topicId: number): Promise<void> {
    const toDelete = Array.from(this.relationships.entries()).filter(
      ([index, rel]) => {
        console.log("index", index);
        return rel.sourceId === String(topicId) || rel.targetId === String(topicId);
      }
    );

    toDelete.forEach(([id, element]) => {
      console.log("element", element);
      this.relationships.delete(id);
    });
  }

  async getGraphData(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const allTopics = await this.getAllTopics();
    const allRelationships = await this.getAllRelationships();

    const nodes: GraphNode[] = allTopics.map((topic) => ({
      id: `node-${topic.id}`,
      name: topic.name,
      type: topic.type as "original" | "generated",
    }));

    const edges: GraphEdge[] = allRelationships.map((rel) => ({
      id: `edge-${rel.id}`,
      source: `node-${rel.sourceId}`,
      target: `node-${rel.targetId}`,
    }));

    return { nodes, edges };
  }
}

export const storage = new MemStorage();
