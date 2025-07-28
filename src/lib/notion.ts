import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_API_KEY,
});

export interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  email?: string;
  userEmail?: string;
  userId?: string;
  currentRoute?: string;
  userAgent?: string;
  timestamp: Date;
  files?: string[];
  fileUrls?: Array<{
    name: string;
    url: string;
    path: string;
    type: string;
  }>;
}

export async function createFeedbackPage(feedbackData: FeedbackData, databaseId: string) {
  try {
    const { rating, category, message, email, userEmail, userId, currentRoute, userAgent, timestamp, files, fileUrls } = feedbackData;
    
    // Create rich text for the message
    const messageRichText = [
      {
        type: 'text' as const,
        text: {
          content: message,
        },
      },
    ];

    // Create properties for the Notion page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: any = {
      'Title': {
        title: [
          {
            type: 'text',
            text: {
              content: `${category} - ${rating}/5 stars. ${message.substring(0, 20)}...`,
            },
          },
        ],
      },
      'Task Description': {
        rich_text: [{
          type: 'text',
          text: { content: message },
        }],
      },
      'Rating': {
        number: rating,
      },
      'Category': {
        select: {
          name: category,
        },
      },
      'User Email': {
        email: userEmail || email || null,
      },
      'Contact Email': {
        email: email || null,
      },
      'User ID': {
        rich_text: userId ? [{
          type: 'text',
          text: { content: userId },
        }] : [],
      },
      'Current Route': {
        rich_text: currentRoute ? [{
          type: 'text',
          text: { content: currentRoute },
        }] : [],
      },
      'User Agent': {
        rich_text: userAgent ? [{
          type: 'text',
          text: { content: userAgent },
        }] : [],
      },
      'Created': {
        date: {
          start: timestamp.toISOString(),
        },
      },
    };

    // Create the page content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children: any[] = [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: 'Feedback Details' },
          }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: messageRichText,
        },
      },
    ];

    // Add uploaded files section
    if (fileUrls && fileUrls.length > 0) {
      children.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{
            type: 'text',
            text: { content: 'Attached Files' },
          }],
        },
      });

      fileUrls.forEach((file, index) => {
        // Check if it's an image to embed it
        const isImage = file.type.startsWith('image/');
        
        if (isImage) {
          // Add image block for images
          children.push({
            object: 'block',
            type: 'image',
            image: {
              type: 'external',
              external: {
                url: file.url,
              },
              caption: [{
                type: 'text',
                text: { content: file.name },
              }],
            },
          });
        } else {
          // Add rich text link for videos and other files
          children.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{
                type: 'text',
                text: { content: `${index + 1}. ` },
              }, {
                type: 'text',
                text: { 
                  content: file.name, 
                  link: { url: file.url } 
                },
                annotations: { 
                  bold: true,
                  color: 'blue' 
                },
              }, {
                type: 'text',
                text: { content: ` (${file.type.includes('video') ? 'Video' : 'File'})` },
              }],
            },
          });
        }
      });
    } else if (files && files.length > 0) {
      // Fallback for when we only have file names without URLs
      children.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{
            type: 'text',
            text: { content: 'Attached Files (Names Only)' },
          }],
        },
      });

      files.forEach((fileName, index) => {
        children.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `${index + 1}. ${fileName}` },
            }],
          },
        });
      });
    }

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties,
      children,
    });

    return response;
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
}

export async function ensureFeedbackDatabase() {
  // This function could be used to create or verify the feedback database exists
  // For now, we'll assume the database is manually created and the ID is provided via environment variables
  const databaseId = process.env.NOTION_FEEDBACK_DATABASE_ID;
  
  if (!databaseId) {
    throw new Error('NOTION_FEEDBACK_DATABASE_ID environment variable is required');
  }
  
  return databaseId;
} 