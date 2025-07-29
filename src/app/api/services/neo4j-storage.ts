import { getSession } from "./neo4j";
import { 
  type Canvas,
  type InsertCanvas,
  type Topic, 
  type InsertTopic, 
  type Relationship, 
  type InsertRelationship,
  type GraphNode,
  type GraphEdge 
} from "@/shared/schema";
import { v4 as uuidv4 } from 'uuid';

export interface INeo4jStorage {
  // Canvas operations
  createCanvas(canvas: InsertCanvas): Promise<Canvas>;
  getCanvas(id: string): Promise<Canvas | undefined>;
  getCanvasesByAuthor(authorId: string): Promise<Canvas[]>;
  updateCanvas(id: string, updates: { name?: string; systemInstruction?: string }): Promise<Canvas | undefined>;
  deleteCanvas(id: string): Promise<void>;
  
  // Topic operations
  createTopic(topic: InsertTopic): Promise<Topic>;
  getTopicById(id: string): Promise<Topic | undefined>;
  getTopicByName(name: string, canvasId: string): Promise<Topic | undefined>;
  getTopicsByCanvas(canvasId: string): Promise<Topic[]>;
  updateTopic(id: string, updates: { name?: string; description?: string; knowledge?: string }): Promise<Topic | undefined>;
  deleteTopic(id: string): Promise<void>;
  getTopicPath(topicId: string, canvasId: string): Promise<string[]>;
  getExistingSiblings(topicId: string, canvasId: string): Promise<string[]>;
  getTopicChildren(topicId: string, canvasId: string): Promise<string[]>;
  
  // Relationship operations
  createRelationship(relationship: InsertRelationship): Promise<Relationship>;
  getRelationshipsByCanvas(canvasId: string): Promise<Relationship[]>;
  deleteRelationshipsByTopicId(topicId: string): Promise<void>;
  relationshipExists(sourceId: string, targetId: string): Promise<boolean>;
  
  // Graph operations
  getGraphData(canvasId: string): Promise<{ nodes: GraphNode[], edges: GraphEdge[] }>;
}

export class Neo4jStorage implements INeo4jStorage {
  
  async createCanvas(insertCanvas: InsertCanvas): Promise<Canvas> {
    const session = getSession();
    const id = uuidv4();
    
    try {
      const result = await session.run(`
        CREATE (c:Canvas {
          id: $id,
          authorId: $authorId,
          name: $name,
          systemInstruction: $systemInstruction,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN c
      `, {
        id,
        authorId: insertCanvas.authorId,
        name: insertCanvas.name,
        systemInstruction: insertCanvas.systemInstruction || ""
      });

      const canvas = result.records[0]?.get('c').properties;
      return {
        id: canvas.id,
        authorId: canvas.authorId,
        name: canvas.name,
        systemInstruction: canvas.systemInstruction || "",
        createdAt: new Date(canvas.createdAt.toString()),
        updatedAt: new Date(canvas.updatedAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async getCanvas(id: string): Promise<Canvas | undefined> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (c:Canvas {id: $id})
        RETURN c
      `, { id });

      if (result.records.length === 0) return undefined;

      const canvas = result.records[0].get('c').properties;
      return {
        id: canvas.id,
        authorId: canvas.authorId,
        name: canvas.name,
        systemInstruction: canvas.systemInstruction || "",
        createdAt: new Date(canvas.createdAt.toString()),
        updatedAt: new Date(canvas.updatedAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async getCanvasesByAuthor(authorId: string): Promise<Canvas[]> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (c:Canvas {authorId: $authorId})
        RETURN c
        ORDER BY c.updatedAt DESC
      `, { authorId });

      return result.records.map(record => {
        const canvas = record.get('c').properties;
        return {
          id: canvas.id,
          authorId: canvas.authorId,
          name: canvas.name,
          systemInstruction: canvas.systemInstruction || "",
          createdAt: new Date(canvas.createdAt.toString()),
          updatedAt: new Date(canvas.updatedAt.toString())
        };
      });
    } finally {
      await session.close();
    }
  }

  async updateCanvas(id: string, updates: { name?: string; systemInstruction?: string }): Promise<Canvas | undefined> {
    const session = getSession();
    
    try {
      const setClause = [];
      const params: Record<string, string> = { id };
      
      if (updates.name !== undefined) {
        setClause.push("c.name = $name");
        params.name = updates.name;
      }
      
      if (updates.systemInstruction !== undefined) {
        setClause.push("c.systemInstruction = $systemInstruction");
        params.systemInstruction = updates.systemInstruction;
      }
      
      if (setClause.length === 0) {
        // No updates provided, just return the current canvas
        return this.getCanvas(id);
      }
      
      setClause.push("c.updatedAt = datetime()");
      
      const result = await session.run(`
        MATCH (c:Canvas {id: $id})
        SET ${setClause.join(', ')}
        RETURN c
      `, params);

      if (result.records.length === 0) return undefined;

      const canvas = result.records[0].get('c').properties;
      return {
        id: canvas.id,
        authorId: canvas.authorId,
        name: canvas.name,
        systemInstruction: canvas.systemInstruction || "",
        createdAt: new Date(canvas.createdAt.toString()),
        updatedAt: new Date(canvas.updatedAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async deleteCanvas(id: string): Promise<void> {
    const session = getSession();
    
    try {
      await session.run(`
        MATCH (c:Canvas {id: $id})
        OPTIONAL MATCH (c)-[:CONTAINS]->(t:Topic)
        DETACH DELETE c, t
      `, { id });
    } finally {
      await session.close();
    }
  }

  async createTopic(insertTopic: Omit<InsertTopic, 'id'>): Promise<Topic> {
    const session = getSession();
    const id = uuidv4();
    
    try {
      const result = await session.run(`
        MATCH (c:Canvas {id: $canvasId})
        CREATE (t:Topic {
          id: $id,
          canvasId: $canvasId,
          name: $name,
          type: $type,
          description: $description,
          knowledge: $knowledge,
          positionX: $positionX,
          positionY: $positionY,
          createdAt: datetime()
        })
        CREATE (c)-[:CONTAINS]->(t)
        RETURN t
      `, {
        id,
        canvasId: insertTopic.canvasId,
        name: insertTopic.name,
        type: insertTopic.type,
        description: insertTopic.description || "",
        knowledge: insertTopic.knowledge || "",
        positionX: insertTopic.positionX || null,
        positionY: insertTopic.positionY || null
      });

      const topic = result.records[0]?.get('t').properties;
      return {
        id: topic.id,
        canvasId: topic.canvasId,
        name: topic.name,
        type: topic.type,
        description: topic.description || "",
        knowledge: topic.knowledge || "",
        positionX: topic.positionX || null,
        positionY: topic.positionY || null,
        createdAt: new Date(topic.createdAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async getTopicById(id: string): Promise<Topic | undefined> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (t:Topic {id: $id})
        RETURN t
      `, { id });

      if (result.records.length === 0) return undefined;

      const topic = result.records[0].get('t').properties;
      return {
        id: topic.id,
        canvasId: topic.canvasId,
        name: topic.name,
        type: topic.type,
        description: topic.description || "",
        knowledge: topic.knowledge || "",
        positionX: topic.positionX || null,
        positionY: topic.positionY || null,
        createdAt: new Date(topic.createdAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async getTopicByName(name: string, canvasId: string): Promise<Topic | undefined> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (t:Topic {name: $name, canvasId: $canvasId})
        RETURN t
      `, { name, canvasId });

      if (result.records.length === 0) return undefined;

      const topic = result.records[0].get('t').properties;
      return {
        id: topic.id,
        canvasId: topic.canvasId,
        name: topic.name,
        type: topic.type,
        description: topic.description || "",
        knowledge: topic.knowledge || "",
        positionX: topic.positionX || null,
        positionY: topic.positionY || null,
        createdAt: new Date(topic.createdAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async getTopicsByCanvas(canvasId: string): Promise<Topic[]> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (t:Topic {canvasId: $canvasId})
        RETURN t
        ORDER BY t.createdAt ASC
      `, { canvasId });

      return result.records.map(record => {
        const topic = record.get('t').properties;
        return {
          id: topic.id,
          canvasId: topic.canvasId,
          name: topic.name,
          type: topic.type,
          description: topic.description || "",
          knowledge: topic.knowledge || "",
          positionX: topic.positionX || null,
          positionY: topic.positionY || null,
          createdAt: new Date(topic.createdAt.toString())
        };
      });
    } finally {
      await session.close();
    }
  }

  async updateTopic(id: string, updates: { name?: string; description?: string; knowledge?: string }): Promise<Topic | undefined> {
    const session = getSession();
    
    try {
      const setClause = [];
      const params: { id: string; name?: string; description?: string; knowledge?: string } = { id };
      
      if (updates.name !== undefined) {
        setClause.push('t.name = $name');
        params.name = updates.name;
      }
      
      if (updates.description !== undefined) {
        setClause.push('t.description = $description');
        params.description = updates.description;
      }
      
      if (updates.knowledge !== undefined) {
        setClause.push('t.knowledge = $knowledge');
        params.knowledge = updates.knowledge;
      }
      
      if (setClause.length === 0) return undefined;
      
      const result = await session.run(`
        MATCH (t:Topic {id: $id})
        SET ${setClause.join(', ')}
        RETURN t
      `, params);

      if (result.records.length === 0) return undefined;

      const topic = result.records[0].get('t').properties;
      return {
        id: topic.id,
        canvasId: topic.canvasId,
        name: topic.name,
        type: topic.type,
        description: topic.description || "",
        knowledge: topic.knowledge || "",
        positionX: topic.positionX || null,
        positionY: topic.positionY || null,
        createdAt: new Date(topic.createdAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async deleteTopic(id: string): Promise<void> {
    const session = getSession();
    
    try {
      await session.run(`
        MATCH (t:Topic {id: $id})
        DETACH DELETE t
      `, { id });
    } finally {
      await session.close();
    }
  }

  async getTopicPath(topicId: string, canvasId: string): Promise<string[]> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH path = (root:Topic)-[:RELATED_TO*0..]->(target:Topic {id: $topicId})
        WHERE NOT ()-[:RELATED_TO]->(root:Topic {canvasId: $canvasId})
        AND root.canvasId = $canvasId
        RETURN [node IN nodes(path) | node.name] AS pathNames
        ORDER BY length(path) ASC
        LIMIT 1
      `, { topicId, canvasId });

      if (result.records.length === 0) return [];

      const pathNames = result.records[0].get('pathNames');
      return pathNames || [];
    } finally {
      await session.close();
    }
  }

  async getExistingSiblings(topicId: string, canvasId: string): Promise<string[]> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (parent:Topic)-[:RELATED_TO]->(current:Topic {id: $topicId, canvasId: $canvasId})
        MATCH (parent)-[:RELATED_TO]->(sibling:Topic)
        WHERE sibling.id <> $topicId
        RETURN COLLECT(sibling.name) AS siblings
      `, { topicId, canvasId });

      if (result.records.length === 0) return [];

      const siblings = result.records[0].get('siblings');
      return siblings || [];
    } finally {
      await session.close();
    }
  }

  async getTopicChildren(topicId: string, canvasId: string): Promise<string[]> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (current:Topic {id: $topicId, canvasId: $canvasId})-[:RELATED_TO]->(child:Topic)
        RETURN COLLECT(child.name) AS children
      `, { topicId, canvasId });

      if (result.records.length === 0) return [];

      const children = result.records[0].get('children');
      return children || [];
    } finally {
      await session.close();
    }
  }

  async createRelationship(insertRelationship: Omit<InsertRelationship, 'id'>): Promise<Relationship> {
    const session = getSession();
    const id = uuidv4();
    
    try {
      const result = await session.run(`
        MATCH (source:Topic {id: $sourceId})
        MATCH (target:Topic {id: $targetId})
        CREATE (source)-[r:RELATED_TO {
          id: $id,
          canvasId: $canvasId,
          sourceId: $sourceId,
          targetId: $targetId,
          createdAt: datetime()
        }]->(target)
        RETURN r
      `, {
        id,
        canvasId: insertRelationship.canvasId,
        sourceId: insertRelationship.sourceId,
        targetId: insertRelationship.targetId
      });

      const rel = result.records[0]?.get('r').properties;
      return {
        id: rel.id,
        canvasId: rel.canvasId,
        sourceId: rel.sourceId,
        targetId: rel.targetId,
        createdAt: new Date(rel.createdAt.toString())
      };
    } finally {
      await session.close();
    }
  }

  async getRelationshipsByCanvas(canvasId: string): Promise<Relationship[]> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH ()-[r:RELATED_TO {canvasId: $canvasId}]->()
        RETURN r
      `, { canvasId });

      return result.records.map(record => {
        const rel = record.get('r').properties;
        return {
          id: rel.id,
          canvasId: rel.canvasId,
          sourceId: rel.sourceId,
          targetId: rel.targetId,
          createdAt: new Date(rel.createdAt.toString())
        };
      });
    } finally {
      await session.close();
    }
  }

  async deleteRelationshipsByTopicId(topicId: string): Promise<void> {
    const session = getSession();
    
    try {
      await session.run(`
        MATCH ()-[r:RELATED_TO]->()
        WHERE r.sourceId = $topicId OR r.targetId = $topicId
        DELETE r
      `, { topicId });
    } finally {
      await session.close();
    }
  }

  async relationshipExists(sourceId: string, targetId: string): Promise<boolean> {
    const session = getSession();
    
    try {
      const result = await session.run(`
        MATCH (s:Topic {id: $sourceId})-[r:RELATED_TO]->(t:Topic {id: $targetId})
        RETURN COUNT(r) > 0 AS exists
      `, { sourceId, targetId });

      return result.records[0].get('exists');
    } finally {
      await session.close();
    }
  }

  async getGraphData(canvasId: string): Promise<{ nodes: GraphNode[], edges: GraphEdge[] }> {
    const topics = await this.getTopicsByCanvas(canvasId);
    const relationships = await this.getRelationshipsByCanvas(canvasId);

    const nodes: GraphNode[] = topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      type: topic.type as 'original' | 'generated',
      description: topic.description || null,
      knowledge: topic.knowledge || null,
      positionX: topic.positionX,
      positionY: topic.positionY
    }));

    const edges: GraphEdge[] = relationships.map(rel => ({
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId
    }));

    return { nodes, edges };
  }
}

export const neo4jStorage = new Neo4jStorage();