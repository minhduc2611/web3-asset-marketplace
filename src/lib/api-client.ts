import axios, { AxiosResponse, AxiosError } from 'axios';
import { AuthResponse } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token automatically
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (for authenticated requests)
    const tokens = localStorage.getItem('auth_tokens');
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        if (parsedTokens.access_token) {
          config.headers.Authorization = `Bearer ${parsedTokens.access_token}`;
        }
      } catch (error) {
        console.error('Error parsing stored tokens:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        success: false,
        error: 'ExternalServiceError',
        message: 'Network error occurred',
      });
    }

    // Handle HTTP error responses
    const status = error.response.status;
    const responseData = error.response.data as any;

    // If the response is already in our AuthResponse format, return it
    if (responseData && typeof responseData === 'object' && 'success' in responseData) {
      return Promise.reject(responseData);
    }

    // Handle common HTTP status codes
    switch (status) {
      case 400:
        return Promise.reject({
          success: false,
          error: 'ValidationError',
          message: responseData?.message || 'Bad request',
        });
      case 401:
        return Promise.reject({
          success: false,
          error: 'AuthenticationFailed',
          message: responseData?.message || 'Unauthorized',
        });
      case 403:
        return Promise.reject({
          success: false,
          error: 'InvalidToken',
          message: responseData?.message || 'Forbidden',
        });
      case 500:
        return Promise.reject({
          success: false,
          error: 'ExternalServiceError',
          message: 'Internal server error',
        });
      default:
        return Promise.reject({
          success: false,
          error: 'ExternalServiceError',
          message: responseData?.message || `HTTP ${status} error`,
        });
    }
  }
);

// Utility function for making authenticated requests
export const makeAuthenticatedRequest = async <T>(
  endpoint: string,
  config: any = {}
): Promise<AuthResponse<T>> => {
  try {
    const response = await apiClient(endpoint, config);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
    };
  } catch (error: any) {
    return error as AuthResponse<T>;
  }
};

// Utility function for making unauthenticated requests
export const makeUnauthenticatedRequest = async <T>(
  endpoint: string,
  config: any = {}
): Promise<AuthResponse<T>> => {
  try {
    // Remove auth header for unauthenticated requests
    const configWithoutAuth = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: undefined,
      },
    };
    
    const response = await apiClient(endpoint, configWithoutAuth);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
    };
  } catch (error: any) {
    return error as AuthResponse<T>;
  }
};

export default apiClient;