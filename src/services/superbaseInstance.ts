import { Database, Tables } from "@/supabase/database.types";
import { createClient } from "@supabase/supabase-js";
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";

class SupabaseInstance {
  private supabaseUrl = "https://skvnrwmwmcvsevknedhm.supabase.co";
  private supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
  private supabase: SupabaseClient<Database> | null = null;
  constructor() {
    try {
      this.supabase = createClient<Database>(
        this.supabaseUrl,
        this.supabaseKey || ""
      );
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
