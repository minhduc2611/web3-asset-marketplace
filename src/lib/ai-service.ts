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
} 