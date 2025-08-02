import {
  SignUpRequest,
  LoginRequest,
  AuthResponse,
  LoginResponse,
  SignupResponse,
  AuthUser,
  StoredTokens,
  OAuthTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";
import { makeAuthenticatedRequest, makeUnauthenticatedRequest } from './api-client';
import { createClient, Provider, SupabaseClient } from "@supabase/supabase-js";

class AuthService {
  private readonly TOKEN_KEY = "auth_tokens";
  private readonly USER_KEY = "auth_user";

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Token management
  private setTokens(tokens: StoredTokens): void {
    if (tokens) {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
    }
  }

  // Public method for setting tokens from external sources (like OAuth callbacks)
  public setTokensFromExternal(tokens: StoredTokens): void {
    this.setTokens(tokens);
  }

  private getTokens(): StoredTokens | null {
    const stored = localStorage.getItem(this.TOKEN_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  private setUser(user: AuthUser): void {
    console.log("setting user", user);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private getUser(): AuthUser | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  // Public methods
  async signup(data: SignUpRequest): Promise<AuthResponse<SignupResponse>> {
    const result = await makeUnauthenticatedRequest<SignupResponse>("/auth/signup", {
      method: "POST",
      data,
    });

    if (result.success && result.data) {
      // Store user data
      this.setUser(result.data.user);

      // Only store tokens if email confirmation is not pending
      if (
        !result.data.email_confirmation_pending &&
        result.data.access_token &&
        result.data.expires_in
      ) {
        const expiresAt = Date.now() + result.data.expires_in * 1000;
        this.setTokens({
          access_token: result.data.access_token,
          refresh_token: result.data.refresh_token,
          expires_at: expiresAt,
        });
      }
    }

    return result;
  }

  async login(payload: LoginRequest): Promise<AuthResponse<LoginResponse>> {
    const result = await makeUnauthenticatedRequest<LoginResponse>("/auth/login", {
      method: "POST",
      data: payload,
    });

    console.log("login result", result);

    if (result.success && result.data) {
      const data = result.data;
      console.log("login result", data);
      const expiresAt = Date.now() + result.data.expires_in * 1000;
      this.setTokens({
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
        expires_at: expiresAt,
      });
      this.setUser(result.data.user);
    }

    return result;
  }

  async logout(): Promise<AuthResponse<void>> {
    const result = await makeAuthenticatedRequest<void>("/auth/logout", {
      method: "POST",
    });

    // Clear local storage regardless of API response
    this.clearStorage();

    return result;
  }

  async verifyToken(): Promise<AuthResponse<AuthUser>> {
    return makeAuthenticatedRequest<AuthUser>("/auth/verify");
  }

  async refreshToken(): Promise<AuthResponse<LoginResponse>> {
    const tokens = this.getTokens();
    if (!tokens?.refresh_token) {
      return {
        success: false,
        error: "MissingToken",
        message: "No refresh token available",
      };
    }

    const result = await makeUnauthenticatedRequest<LoginResponse>("/auth/refresh", {
      method: "POST",
      data: { refresh_token: tokens.refresh_token },
    });

    if (result.success && result.data) {
      const expiresAt = Date.now() + result.data.expires_in * 1000;
      this.setTokens({
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token || tokens.refresh_token,
        expires_at: expiresAt,
      });
      this.setUser(result.data.user);
    } else {
      // If refresh fails, clear storage
      this.clearStorage();
    }

    return result;
  }

  async getUserById(userId: string): Promise<AuthResponse<AuthUser>> {
    return makeAuthenticatedRequest<AuthUser>(`/auth/user/${userId}`);
  }

  async verifyOAuthToken(
    data: OAuthTokenRequest,
  ): Promise<AuthResponse<AuthUser>> {
    const result = await makeUnauthenticatedRequest<AuthUser>("/auth/oauth/verify", {
      method: "POST",
      data,
    });

    if (result.success && result.data) {
      // Store user data when OAuth verification succeeds
      this.setUser(result.data);
    }

    console.log("verifyOAuthToken result", result);
    if (data.access_token && data.refresh_token && data.expires_at) {
      this.setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      });
    }

    return result;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse<void>> {
    return makeUnauthenticatedRequest<void>("/auth/forgot-password", {
      method: "POST",
      data,
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse<LoginResponse>> {
    const result = await makeUnauthenticatedRequest<LoginResponse>("/auth/reset-password", {
      method: "POST",
      data,
    });

    if (result.success && result.data) {
      // Store tokens and user data after successful password reset
      const expiresAt = Date.now() + (result.data.expires_in * 1000);
      this.setTokens({
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
        expires_at: expiresAt,
      });
      this.setUser(result.data.user);
    }

    return result;
  }

  async getValidToken(): Promise<string | null> {
    const tokens = this.getTokens();
    if (!tokens) return null;

    // If token is not expired, return it
    if (!this.isTokenExpired(tokens.expires_at)) {
      return tokens.access_token;
    }

    // Try to refresh the token
    const refreshResult = await this.refreshToken();
    if (refreshResult.success && refreshResult.data) {
      return refreshResult.data.access_token;
    }

    return null;
  }

  getCurrentUser(): AuthUser | null {
    return this.getUser();
  }

  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    const user = this.getUser();
    return !!(tokens && user && !this.isTokenExpired(tokens.expires_at));
  }

  // Error handling utility
  handleAuthError(result: AuthResponse<unknown>): string {
    switch (result.error) {
      case "ValidationError":
        return "Please check your input and try again.";
      case "AuthenticationFailed":
        return "Invalid email or password.";
      case "InvalidToken":
      case "TokenExpired":
        // Clear tokens and redirect to login
        this.clearStorage();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return "Session expired. Please log in again.";
      case "UserNotFound":
        return "User not found.";
      case "ExternalServiceError":
        return "Service temporarily unavailable. Please try again later.";
      default:
        return result.message || "An unexpected error occurred.";
    }
  }

  async signInWithOAuth(provider: Provider) {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    console.log("signInWithOAuth data", data);
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;