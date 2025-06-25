# Dive - Meaningful Conversations App

A Next.js web app that helps groups of friends have meaningful conversations through AI-generated questions.

## Features

- **Room Creation**: Hosts can create rooms with unique IDs and passcodes
- **QR Code Generation**: Easy sharing via QR codes
- **User Submissions**: Participants share their interests and what they want to learn
- **AI-Generated Questions**: OpenAI creates personalized questions based on participant info
- **Real-time Updates**: See who has joined and when questions are ready

## Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 2. Database Setup

Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy the contents of supabase-schema.sql
```

This creates:
- `dive_rooms` - Stores room information
- `dive_user_submissions` - Stores participant information
- `dive_questions` - Stores generated questions

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000/dive](http://localhost:3000/dive) to see the app.

## How It Works

### 1. Create a Room
- Host clicks "Create Room"
- App generates unique `roomId` (8 characters) and `passcode` (6 digits)
- Host gets shareable link and QR code

### 2. Join a Room
- Friends can join via:
  - Room link (e.g., `/dive/room/abc123`)
  - QR code scan
  - Entering passcode manually

### 3. Submit Information
- Each participant fills out:
  - Name
  - Interests
  - What they want to learn about others

### 4. Generate Questions
- Host clicks "Generate Questions"
- App fetches all submissions
- OpenAI generates 20 personalized questions
- Questions are displayed for the group

## API Routes

- `POST /api/dive/create-room` - Create new room
- `POST /api/dive/join-room` - Join room with ID or passcode
- `GET /api/dive/room/[roomId]/status` - Get room status and participants
- `POST /api/dive/room/[roomId]/submit` - Submit user information
- `GET /api/dive/room/[roomId]/user-submission` - Check existing submission
- `POST /api/dive/room/[roomId]/generate-questions` - Generate AI questions
- `GET /api/dive/room/[roomId]/questions` - Get generated questions

## Components

- `CreateRoomForm` - Room creation with sharing options
- `JoinRoomForm` - Join room via ID or passcode
- `UserSubmissionForm` - Submit participant information
- `RoomView` - Main room interface with different states
- `QuestionsView` - Display generated questions

## Session Management

The app uses simple localStorage-based session management:
- Each user gets a unique session ID
- Sessions persist across browser sessions
- Prevents duplicate submissions per room

## Styling

Built with:
- Tailwind CSS for styling
- Radix UI components for accessibility
- Lucide React for icons
- Sonner for toast notifications

## Production Considerations

For production deployment:

1. **Authentication**: Implement proper user authentication
2. **Rate Limiting**: Add rate limiting to API routes
3. **Error Handling**: Improve error handling and logging
4. **Session Management**: Use secure session management
5. **Database**: Add proper indexes and optimize queries
6. **Security**: Add input validation and sanitization

## Troubleshooting

### Common Issues

1. **Room not found**: Check if the room ID is correct
2. **Questions not generating**: Verify OpenAI API key is set
3. **Database errors**: Ensure Supabase schema is properly set up
4. **Session issues**: Clear browser localStorage and try again

### Development Tips

- Use browser dev tools to check network requests
- Check Supabase logs for database errors
- Verify environment variables are loaded correctly
- Test with multiple browser sessions to simulate different users 