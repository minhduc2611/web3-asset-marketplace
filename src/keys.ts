// Query keys for React Query
// Centralized location for all API query keys

// Canvas related keys
export const getCanvasGraphDataKey = (canvasId: string) => `/api/v1/canvas/${canvasId}/graph-data`;
export const getCanvasKey = (canvasId: string) => `/api/v1/canvas/${canvasId}`;

// Collections related keys
export const getCollectionsKey = () => `/api/v1/collections`;
