import { NextRequest, NextResponse } from 'next/server';
import { createFeedbackPage, ensureFeedbackDatabase, FeedbackData } from '@/lib/notion';
import { createServerSupabaseClient } from '@/lib/supabase.server';

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

    // Handle file uploads
    const files: string[] = [];
    const fileKeys = Array.from(formData.keys()).filter(key => key.startsWith('file_'));
    
    for (const key of fileKeys) {
      const file = formData.get(key) as File;
      if (file) {
        files.push(file.name);
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
    };

    // Get Notion database ID
    const databaseId = await ensureFeedbackDatabase();

    // Create page in Notion
    const notionResponse = await createFeedbackPage(feedbackData, databaseId);

    console.log('Feedback submitted successfully:', {
      notionPageId: notionResponse.id,
      userEmail,
      category,
      rating,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      notionPageId: notionResponse.id,
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