// Client-side utilities for OpenAI integration
// Note: Actual OpenAI calls are made server-side for security

export interface KeywordGenerationResult {
  keywords: Array<{
    id: string;
    name: string;
    type: 'original' | 'generated';
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

export class OpenAIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'OpenAIError';
  }
}
