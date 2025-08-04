import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { canvasService } from '@/lib/canvas-service';
import { Canvas, CreateCanvasRequest, UpdateCanvasRequest } from '@/shared/schema';
import { AuthResponse } from '@/types/auth';
import { toast } from 'sonner';

// Query keys
export const canvasKeys = {
  all: ['canvases'] as const,
  lists: () => [...canvasKeys.all, 'list'] as const,
  list: (params?: { author_id?: string; limit?: number; offset?: number }) => 
    [...canvasKeys.lists(), params] as const,
  details: () => [...canvasKeys.all, 'detail'] as const,
  detail: (id: string) => [...canvasKeys.details(), id] as const,
};

// Hook for listing canvases with pagination
export const useCanvases = (params?: {
  author_id?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: canvasKeys.list(params),
    queryFn: () => canvasService.list(params),
    enabled: !!params?.author_id, // Only call API if author_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for getting a single canvas
export const useCanvas = (id: string) => {
  return useQuery({
    queryKey: canvasKeys.detail(id),
    queryFn: () => canvasService.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for creating a canvas
export const useCreateCanvas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCanvasRequest) => canvasService.create(data),
    onSuccess: (response) => {
      // Invalidate and refetch canvas lists
      queryClient.invalidateQueries({ queryKey: canvasKeys.lists() });
      
      toast.success('Canvas created successfully', {
        description: `Created: ${response.name}`,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create canvas', {
        description: error.message,
      });
    },
  });
};

// Hook for updating a canvas
export const useUpdateCanvas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCanvasRequest }) =>
      canvasService.update(id, data),
    onSuccess: (response, { id }) => {
      // Update the specific canvas in cache
      queryClient.setQueryData(canvasKeys.detail(id), response);
      
      // Invalidate and refetch canvas lists
      queryClient.invalidateQueries({ queryKey: canvasKeys.lists() });
      
      toast.success('Canvas updated successfully', {
        description: `Updated: ${response.name}`,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to update canvas', {
        description: error.message,
      });
    },
  });
};

// Hook for deleting a canvas
export const useDeleteCanvas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => canvasService.delete(id),
    onSuccess: (_, id) => {
      // Remove the canvas from cache
      queryClient.removeQueries({ queryKey: canvasKeys.detail(id) });
      
      // Invalidate and refetch canvas lists
      queryClient.invalidateQueries({ queryKey: canvasKeys.lists() });
      
      toast.success('Canvas deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete canvas', {
        description: error.message,
      });
    },
  });
};

// Utility hook for optimistic updates
export const useOptimisticCanvasUpdate = () => {
  const queryClient = useQueryClient();

  return {
    updateCanvasOptimistically: (id: string, updates: Partial<Canvas>) => {
      queryClient.setQueryData(canvasKeys.detail(id), (old: Canvas) => {
        if (!old) return old;
        return {
          ...old,
          ...updates,
        };
      });
    },
    
    updateCanvasListOptimistically: (updates: Partial<Canvas>) => {
      queryClient.setQueriesData(
        { queryKey: canvasKeys.lists() },
        (old: AuthResponse<Canvas[]>) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((canvas: Canvas) =>
              canvas.id === updates.id ? { ...canvas, ...updates } : canvas
            ),
          };
        }
      );
    },
  };
}; 