import { v4 as uuidv4 } from "uuid";

// Simple session management for the dive app
// In a production app, you'd want to use proper session management

const SESSION_KEY = "dive_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  
  localStorage.removeItem(SESSION_KEY);
}

export function setSessionId(sessionId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  
  localStorage.setItem(SESSION_KEY, sessionId);
} 