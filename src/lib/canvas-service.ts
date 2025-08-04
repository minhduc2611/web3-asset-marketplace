import { makeAuthenticatedRequest } from './api-client';
import { Canvas, CreateCanvasRequest, UpdateCanvasRequest } from '@/shared/schema';
import { AuthResponse } from '@/types/auth';

/**
 * Canvas Service - Updated to match new API specification
 * 
 * API Base URL: /api/v1/canvas
 * 
 * All endpoints follow the standard response format:
 * {
 *   "success": boolean,
 *   "data": object | array | null,
 *   "pagination": object | null,
 *   "message": string | null,
 *   "error": string | null
 * }
 * 
 * Pagination format:
 * {
 *   "total": number,
 *   "limit": number,
 *   "offset": number,
 *   "current_page": number,
 *   "total_pages": number,
 *   "has_next": boolean,
 *   "has_previous": boolean
 * }
 */

// Canvas service class
export class CanvasService {
  private static readonly BASE_URL = '/api/v1/canvas';

  /**
   * List canvases with pagination
   */
  static async listCanvases(params?: {
    author_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuthResponse<Canvas[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.author_id) {
      queryParams.append('author_id', params.author_id);
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const url = `${CanvasService.BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('CanvasService.BASE_URL', CanvasService.BASE_URL);
    console.log('url', url);
    const response = await makeAuthenticatedRequest<Canvas[]>(url, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch canvases');
    }
    console.log('PaginatedResponse', response);

    return response as AuthResponse<Canvas[]>;
  }

  /**
   * Get a single canvas by ID
   */
  static async getCanvas(id: string): Promise<Canvas> {
    const response = await makeAuthenticatedRequest<Canvas>(`${CanvasService.BASE_URL}/${id}`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch canvas');
    }

    return response.data as Canvas;
  }

  /**
   * Create a new canvas
   */
  static async createCanvas(data: CreateCanvasRequest): Promise<Canvas> {
    const response = await makeAuthenticatedRequest<Canvas>(CanvasService.BASE_URL, {
      method: 'POST',
      data: {
        author_id: data.authorId,
        name: data.name,
        system_instruction: data.systemInstruction || '',
      },
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to create canvas');
    }

    return response.data as Canvas;
  }

  /**
   * Update an existing canvas
   */
  static async updateCanvas(id: string, data: UpdateCanvasRequest): Promise<Canvas> {
    const updateData: Record<string, string> = {};
    
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.system_instruction !== undefined) {
      updateData.system_instruction = data.system_instruction;
    }

    const response = await makeAuthenticatedRequest<Canvas>(`${CanvasService.BASE_URL}/${id}`, {
      method: 'PUT',
      data: updateData,
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to update canvas');
    }

    return response.data as Canvas;
  }

  /**
   * Delete a canvas
   */
  static async deleteCanvas(id: string): Promise<void> {
    const response = await makeAuthenticatedRequest<void>(`${CanvasService.BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete canvas');
    }
  }
}

// Export individual functions for easier use with React Query
export const canvasService = {
  list: CanvasService.listCanvases,
  get: CanvasService.getCanvas,
  create: CanvasService.createCanvas,
  update: CanvasService.updateCanvas,
  delete: CanvasService.deleteCanvas,
}; 