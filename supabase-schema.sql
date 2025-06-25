-- Dive Conversation App Schema

-- Create rooms table
CREATE TABLE IF NOT EXISTS dive_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id VARCHAR(8) UNIQUE NOT NULL,
  passcode VARCHAR(6) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'questions', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user submissions table
CREATE TABLE IF NOT EXISTS dive_user_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id VARCHAR(8) NOT NULL REFERENCES dive_rooms(room_id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For tracking user sessions
  name VARCHAR(100) NOT NULL,
  interests TEXT NOT NULL,
  want_to_learn TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, session_id)
);

-- Create questions table
CREATE TABLE IF NOT EXISTS dive_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id VARCHAR(8) NOT NULL REFERENCES dive_rooms(room_id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dive_rooms_room_id ON dive_rooms(room_id);
CREATE INDEX IF NOT EXISTS idx_dive_rooms_passcode ON dive_rooms(passcode);
CREATE INDEX IF NOT EXISTS idx_dive_user_submissions_room_id ON dive_user_submissions(room_id);
CREATE INDEX IF NOT EXISTS idx_dive_questions_room_id ON dive_questions(room_id);

-- Enable Row Level Security (RLS)
ALTER TABLE dive_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE dive_user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dive_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a simple app without authentication)
CREATE POLICY "Allow public read access to rooms" ON dive_rooms
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to rooms" ON dive_rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to rooms" ON dive_rooms
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to user submissions" ON dive_user_submissions
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to user submissions" ON dive_user_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to questions" ON dive_questions
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to questions" ON dive_questions
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_dive_rooms_updated_at
  BEFORE UPDATE ON dive_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 