import { makeAuthenticatedRequest } from './api-client';
import { GraphNode } from '@/shared/schema';
import { AuthResponse } from '@/types/auth';

/**
 * Node Service - Updated to match new API specification
 * 
 * API Base URL: /api/v1/nodes
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

// Node service class
export class NodeService {
  private static readonly BASE_URL = '/api/v1/nodes';

  /**
   * Get a single node by ID
   */
  static async getNode(nodeId: string): Promise<AuthResponse<GraphNode>> {
    const response = await makeAuthenticatedRequest<GraphNode>(
      `${NodeService.BASE_URL}/${nodeId}`,
      {
        method: 'GET',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch node');
    }

    return response;
  }

  /**
   * Create a new node
   */
  static async createNode(data: {
    name: string;
    canvas_id: string;
    parent_node_id?: string;
    description?: string;
    knowledge?: string;
    node_type?: string;
    position_x?: number | null;
    position_y?: number | null;
  }): Promise<AuthResponse<GraphNode>> {
    const response = await makeAuthenticatedRequest<GraphNode>(
      NodeService.BASE_URL,
      {
        method: 'POST',
        data,
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to create node');
    }

    return response;
  }

  /**
   * Update an existing node
   */
  static async updateNode(
    nodeId: string,
    data: {
      name?: string;
      description?: string;
      knowledge?: string;
      node_type?: string;
      position_x?: number | null;
      position_y?: number | null;
    }
  ): Promise<AuthResponse<GraphNode>> {
    const response = await makeAuthenticatedRequest<GraphNode>(
      `${NodeService.BASE_URL}/${nodeId}`,
      {
        method: 'PUT',
        data,
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to update node');
    }

    return response;
  }

  /**
   * Delete a node
   */
  static async deleteNode(nodeId: string): Promise<AuthResponse<null>> {
    const response = await makeAuthenticatedRequest<null>(
      `${NodeService.BASE_URL}/${nodeId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete node');
    }

    return response;
  }
}
