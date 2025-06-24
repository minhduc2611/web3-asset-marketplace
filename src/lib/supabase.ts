import { createClient, type Session, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentSession: Session | null = null;

export const setSession = (newSession: Session) => {
  currentSession = newSession;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("FE >>>>>>>>> user: ", user);
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
  currentSession = null;
};