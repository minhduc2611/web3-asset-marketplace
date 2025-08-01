import { AuthUser, AuthResponse } from "@/types/auth";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

/**
 * Server-side authentication utilities for API routes
 */
export class ServerAuthService {
  static async verifyTokenFromHeaders(headers: Headers): Promise<AuthUser | null> {
    const authorization = headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return null;
    }

    const token = authorization.substring(7);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout for server requests
      });

      const result: AuthResponse<AuthUser> = response.data;
      return result.success ? result.data || null : null;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  static async getCurrentUserFromRequest(request: Request): Promise<AuthUser | null> {
    return this.verifyTokenFromHeaders(request.headers);
  }
}

export default ServerAuthService;