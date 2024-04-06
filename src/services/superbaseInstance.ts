import { Database } from "@/supabase/database.types";
import { createBrowserClient } from '@supabase/ssr';
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
class SupabaseInstance {
  private supabase: SupabaseClient<Database> | null = null;
  constructor() {
    try {
      this.supabase = createClient();
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
