import { pgTable, text, timestamp, integer, varchar, doublePrecision, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Canvas table for multi-user support
export const canvases = pgTable("canvases", {
  id: varchar("id").primaryKey(),
  author_id: varchar("author_id").notNull(),
  name: text("name").notNull(),
  system_instruction: text("system_instruction").default(""),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey(),
  canvasId: varchar("canvas_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'original' or 'generated'
  description: text("description").default(""),
  knowledge: text("knowledge").default(""),
  positionX: doublePrecision("position_x"),
  positionY: doublePrecision("position_y"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const relationships = pgTable("relationships", {
  id: varchar("id").primaryKey(),
  canvasId: varchar("canvas_id").notNull(),
  sourceId: varchar("source_id").notNull(),
  targetId: varchar("target_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCanvasSchema = createInsertSchema(canvases).omit({
  id: true,
  author_id: true,
  created_at: true,
  updated_at: true,
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
  createdAt: true,
});

export const insertRelationshipSchema = createInsertSchema(relationships).omit({
  id: true,
  createdAt: true,
});

export type InsertCanvas = typeof canvases.$inferInsert;
export type Canvas = typeof canvases.$inferSelect;
export type InsertTopic = typeof topics.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type InsertRelationship = typeof relationships.$inferInsert;
export type Relationship = typeof relationships.$inferSelect;

// Request/Response schemas for API
export const createCanvasSchema = z.object({
  name: z.string().min(1).max(100),
  authorId: z.string().min(1),
  systemInstruction: z.string().optional(),
});

export const updateCanvasSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  system_instruction: z.string().optional(),
});

export const createNodeSchema = z.object({
  name: z.string().min(1).max(100),
  canvasId: z.string().min(1),
  parentNodeId: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const generateKeywordsSchema = z.object({
  name: z.string().min(1).max(100),
  canvasId: z.string().min(1),
  nodeCount: z.number().min(1).max(15).optional(),
  isAutomatic: z.boolean().optional(),
});

export type CreateCanvasRequest = z.infer<typeof createCanvasSchema>;
export type UpdateCanvasRequest = z.infer<typeof updateCanvasSchema>;
export type CreateNodeRequest = z.infer<typeof createNodeSchema>;
export type GenerateKeywordsRequest = z.infer<typeof generateKeywordsSchema>;

export interface GraphNode {
  id: string;
  name: string;
  type: 'original' | 'generated';
  description?: string | null;
  knowledge?: string | null;
  positionX?: number | null;
  positionY?: number | null;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GenerateKeywordsResponse {
  keywords: GraphNode[];
  edges: GraphEdge[];
}

// Flashcard Collections table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  authorId: varchar("author_id"),
  sharedAuthorIds: text("shared_author_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;

// Flashcards table
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id"),
  term: text("term"),
  definition: text("definition"),
  shortAnswer: text("short_answer"),
  singleAnswer: text("single_answer"),
  mediaUrl: text("media_url"),
  audioUrl: text("audio_url"),
  interval: integer("interval"),
  nextReviewTime: timestamp("next_review_time"),
  authorId: varchar("author_id"),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});


export interface FlashcardStats {
  totalCards: number;
  cardsReviewed: number;
  masteryBreakdown: {
    new: number;
    learning: number;
    review: number;
    mastered: number;
  };
  streakDays: number;
  dailyProgress: {
    date: string;
    cardsReviewed: number;
  }[];
}

// Document parsing schemas
export const parseDocumentSchema = z.object({
  file: z.instanceof(File),
});

export type ParseDocumentRequest = z.infer<typeof parseDocumentSchema>;

export interface ParseDocumentResponse {
  text: string;
  filename: string;
  fileType: 'pdf' | 'docx';
  wordCount: number;
  success: boolean;
}

// Chat schemas
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  canvasId: z.string().min(1).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export interface ChatResponse {
  message: string;
  sources?: Array<{
    filename: string;
    text: string;
    relevanceScore?: number;
  }>;
  success: boolean;
}
