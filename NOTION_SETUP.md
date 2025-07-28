# Notion Integration Setup Guide

This guide will help you set up the Notion integration for collecting user feedback.

## Prerequisites

1. A Notion workspace
2. Admin access to create integrations and databases

## Step 1: Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "MindGraph Feedback")
4. Select the workspace where you want to store feedback
5. Click "Submit"
6. Copy the **Internal Integration Token** - this will be your `NOTION_INTEGRATION_API_KEY`

## Step 2: Create a Feedback Database

1. In your Notion workspace, create a new database (full page)
2. Name it "User Feedback" or similar
3. Set up the following properties (columns):

### Required Properties:
- **Title** (Title) - Auto-generated based on feedback
- **Rating** (Number) - Star rating from 1-5
- **Category** (Select) - Type of feedback
  - Add options: `general`, `feature`, `bug`, `improvement`
- **User Email** (Email) - Email of the authenticated user
- **Contact Email** (Email) - Optional contact email provided by user
- **User ID** (Text) - Supabase user ID
- **Current Route** (Text) - Page where feedback was submitted
- **User Agent** (Text) - Browser/device information
- **Created** (Date) - When feedback was submitted

3. Copy the database ID from the URL:
   - Database URL: `https://notion.so/workspace/DATABASE_ID?v=...`
   - The `DATABASE_ID` part is your `NOTION_FEEDBACK_DATABASE_ID`

## Step 3: Grant Integration Access

1. Open your feedback database in Notion
2. Click the "..." menu (three dots) in the top right
3. Select "Connect to" and choose your integration
4. This gives the integration permission to create pages in this database

## Step 4: Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Notion Integration
NOTION_INTEGRATION_API_KEY=secret_your_integration_token_here
NOTION_FEEDBACK_DATABASE_ID=your_database_id_here
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to any page in your app
3. Click the feedback button (purple circle in bottom left)
4. Fill out and submit a feedback form
5. Check your Notion database - a new page should appear with the feedback details

## Database Schema

The integration will create pages with this structure:

```
📝 Feedback: [category] - [rating]/5 stars
├── 📊 Properties
│   ├── Rating: [1-5]
│   ├── Category: [general|feature|bug|improvement]
│   ├── User Email: [user@example.com]
│   ├── Contact Email: [contact@example.com]
│   ├── User ID: [supabase-user-id]
│   ├── Current Route: [/path/to/page]
│   ├── User Agent: [browser info]
│   └── Created: [timestamp]
└── 📄 Content
    ├── Feedback Details
    ├── [User's message]
    └── Attached Files (if any)
        ├── 1. filename1.jpg
        └── 2. filename2.png
```

## Troubleshooting

### Common Issues:

1. **"NOTION_INTEGRATION_API_KEY is not set"**
   - Make sure the environment variable is set correctly
   - Restart your development server after adding the variable

2. **"NOTION_FEEDBACK_DATABASE_ID environment variable is required"**
   - Ensure you've copied the correct database ID from the Notion URL
   - The ID should be a long string of letters and numbers

3. **Permission errors**
   - Make sure you've connected the integration to your database (Step 3)
   - Verify the integration has access to the correct workspace

4. **Property type errors**
   - Ensure your database has all the required properties with correct types
   - Check that select options for "Category" include: general, feature, bug, improvement

### Testing Integration:

```bash
# Test API endpoint directly
curl -X POST http://localhost:3000/api/feedback/submit \
  -F "rating=5" \
  -F "category=feature" \
  -F "message=Test feedback message" \
  -F "email=test@example.com"
```

## Security Notes

- Never commit your integration token to version control
- The integration token gives access to your Notion workspace
- Consider using different integrations for development and production
- Regularly rotate your integration tokens for security 