import { createServerSupabaseClient } from './supabase.server';

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

export class SupabaseStorageService {
  private bucketName = 'feedback-files';

  async uploadFile(file: File, userId?: string): Promise<UploadResult> {
    const supabase = await createServerSupabaseClient();
    
    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${random}.${fileExtension}`;
    console.log("fileName", fileName);
    console.log("userId", userId);
    // Create path with user organization
    const folderPath = userId ? `user-${userId}` : 'anonymous';
    const filePath = `${folderPath}/${fileName}`;
    console.log("filePath", filePath);
    // Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
      fileName: file.name
    };
  }

  async uploadMultipleFiles(files: File[], userId?: string): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, userId));
    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async ensureBucketExists(): Promise<void> {
    const supabase = await createServerSupabaseClient();
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(this.bucketName, {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        throw new Error(`Bucket creation failed: ${createError.message}`);
      }
    }
  }
}

export const storageService = new SupabaseStorageService(); 