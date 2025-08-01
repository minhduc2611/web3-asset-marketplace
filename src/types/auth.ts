// Request Types
export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface OAuthTokenRequest {
  access_token: string;
  provider: string;
  refresh_token: string;
  expires_at: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  token: string;
}

// Response Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: AuthUser;
  expires_in: number;
}

export interface SignupResponse {
  access_token?: string;
  refresh_token?: string;
  user: AuthUser;
  expires_in?: number;
  email_confirmation_pending?: boolean  ;
  message?: string;
}


export interface AuthResponse<T = object> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type AuthError = 
  | 'ValidationError'
  | 'AuthenticationFailed'
  | 'InvalidToken'
  | 'TokenExpired'
  | 'UserNotFound'
  | 'ExternalServiceError'
  | 'MissingToken';

// Token storage interface
export interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}