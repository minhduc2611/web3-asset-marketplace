import { NextRequest, NextResponse } from 'next/server';
import { createFeedbackPage, ensureFeedbackDatabase, FeedbackData } from '@/lib/notion';
import { createServerSupabaseClient } from '@/lib/supabase.server';
import { storageService } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    // Get form data
    const formData = await req.formData();
    
    const rating = parseInt(formData.get('rating') as string);
    const category = formData.get('category') as string;
    const message = formData.get('message') as string;
    const email = formData.get('email') as string;
    
    // Validate required fields
    if (!rating || !category || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: rating, category, and message are required' },
        { status: 400 }
      );
    }

    // Get current user from Supabase
    let userEmail: string | undefined;
    let userId: string | undefined;
    
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        userEmail = user.email;
        userId = user.id;
      }
    } catch (error) {
      console.log('Could not get user from Supabase:', error);
      // Continue without user info if authentication fails
    }

    // Get request information - prefer form data, fallback to headers
    const userAgent = (formData.get('userAgent') as string) || req.headers.get('user-agent') || undefined;
    const currentRouteFromForm = formData.get('currentRoute') as string;
    let currentRoute: string | undefined = currentRouteFromForm;
    
    // Fallback to referer header if no route in form data
    if (!currentRoute) {
      const referer = req.headers.get('referer');
      if (referer) {
        try {
          const url = new URL(referer);
          currentRoute = url.pathname + url.search;
        } catch {
          currentRoute = referer;
        }
      }
    }

    // Handle file uploads - Upload to Supabase Storage
    const files: string[] = [];
    const uploadedFiles: Array<{ name: string; url: string; path: string; type: string }> = [];
    const fileKeys = Array.from(formData.keys()).filter(key => key.startsWith('file_'));
    
    // // Ensure storage bucket exists
    // try {
    //   await storageService.ensureBucketExists();
    // } catch (error) {
    //   console.log('Warning: Could not ensure bucket exists:', error);
    //   // Continue without stopping the process
    // }
    
    // Upload files to Supabase Storage
    for (const key of fileKeys) {
      const file = formData.get(key) as File;
      if (file) {
        files.push(file.name);
        
        try {
          console.log(`Uploading file to Supabase: ${file.name} (${file.type})`);
          const uploadResult = await storageService.uploadFile(file, userId);
          uploadedFiles.push({
            name: file.name,
            url: uploadResult.url,
            path: uploadResult.path,
            type: file.type,
          });
          console.log(`Successfully uploaded file: ${file.name} to ${uploadResult.url}`);
        } catch (uploadError) {
          console.error(`Failed to upload file ${file.name}:`, uploadError);
          // Continue with other files even if one fails
        }
      }
    }

    // Prepare feedback data for Notion
    const feedbackData: FeedbackData = {
      rating,
      category,
      message,
      email: email || undefined,
      userEmail,
      userId,
      currentRoute,
      userAgent,
      timestamp: new Date(),
      files: files.length > 0 ? files : undefined,
      fileUrls: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    };

    // Get Notion database ID
    const databaseId = await ensureFeedbackDatabase();

    // Create page in Notion
    const notionResponse = await createFeedbackPage(feedbackData, databaseId);

    // console.log('Feedback submitted successfully:', {
    //   notionPageId: notionResponse.id,
    //   userEmail,
    //   category,
    //   rating,
    //   filesUploaded: uploadedFiles.length,
    //   fileUrls: uploadedFiles.map(f => f.url),
    // });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      notionPageId: notionResponse.id,
      filesUploaded: uploadedFiles.length,
      fileUrls: uploadedFiles.map(f => ({ name: f.name, url: f.url })),
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit feedback',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 