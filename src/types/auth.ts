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
  redirect_to: string;
}

export interface ResetPasswordRequest {
  password: string;
}

// Response Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  email_verified?: boolean;
  phone?: string;
  phone_verified?: boolean;
  role?: string;
  providers: string[];
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  is_anonymous?: boolean;
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