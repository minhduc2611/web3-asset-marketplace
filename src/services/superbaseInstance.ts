import { Database } from "@/supabase/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";

class SupabaseInstance {
  private supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  private supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
  private supabase: SupabaseClient<Database> | null = null;
  constructor() {
    try {
      this.supabase = createClientComponentClient();
    } catch (e) {
      console.error("supabase: ", e);
    }
  }
  getInstance(): SupabaseClient<Database, 'public'> {
    if (this.supabase) {
      return this.supabase;
    } else {
      return new SupabaseInstance().getInstance();
    }
  }
}

export default new SupabaseInstance();
