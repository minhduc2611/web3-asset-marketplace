// TODO: Implement file storage service for Rust backend
// import { createServerSupabaseClient } from './supabase.server';

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

export class StorageService {
  private bucketName = 'feedback-files';

  async uploadFile(file: File, userId?: string): Promise<UploadResult> {
    // TODO: Implement file upload with Rust backend
    throw new Error('File upload not yet implemented with new backend');
  }

  async uploadMultipleFiles(files: File[], userId?: string): Promise<UploadResult[]> {
    // TODO: Implement multiple file upload with Rust backend
    throw new Error('Multiple file upload not yet implemented with new backend');
  }

  async deleteFile(filePath: string): Promise<void> {
    // TODO: Implement file deletion with Rust backend
    throw new Error('File deletion not yet implemented with new backend');
  }

  async ensureBucketExists(): Promise<void> {
    // TODO: Implement bucket management with Rust backend
    console.log('Bucket management not yet implemented with new backend');
  }
}

export const storageService = new StorageService(); 