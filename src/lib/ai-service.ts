import { makeAuthenticatedRequest } from './api-client';

export interface GenerateKeywordsRequest {
  canvas_id: string;
  topic_name: string;
  node_count: number;
  is_automatic: boolean;
}

export interface GenerateKeywordsResponse {
  edges: string[];
  keywords: string[];
}

export interface GenerateInsightsRequest {
  topic_node_id: string;
  canvas_id: string;
  system_instruction: string;
  include_web_search?: boolean;
  include_news_search?: boolean;
}

export interface GenerateInsightsResponse {
  canvas_id: string;
  document_context: [];
  generated_at: string;
  insights: string;
  news_search_results: [];
  question: string;
  topic_node_id: string;
  web_search_results: [];
}

/**
 * AI Service - Handles AI-related API operations
 * 
 * API Base URL: /api/v1/ai
 * 
 * All endpoints follow the standard response format:
 * {
 *   "success": boolean,
 *   "data": object | array | null,
 *   "pagination": object | null,
 *   "message": string | null,
 *   "error": string | null
 * }
 */

// AI service class
export class AIService {
  private static readonly BASE_URL = '/api/v1/ai';

  /**
   * Generate keywords for a canvas topic
   */
  static async generateKeywords(data: GenerateKeywordsRequest): Promise<GenerateKeywordsResponse> {
    const response = await makeAuthenticatedRequest<GenerateKeywordsResponse>(
      `${AIService.BASE_URL}/generate-keywords`,
      {
        method: 'POST',
        data,
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to generate keywords');
    }

    return response.data as GenerateKeywordsResponse;
  }

  /**
   * Generate insights for a topic node
   */
  static async generateInsightsForTopicNode(data: GenerateInsightsRequest): Promise<GenerateInsightsResponse> {
    const response = await makeAuthenticatedRequest<GenerateInsightsResponse>(
      `${AIService.BASE_URL}/generate-insights-for-topic-node`,
      {
        method: 'POST',
        data,
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to generate insights');
    }

    return response.data as GenerateInsightsResponse;
  }
} 