import { User } from "@supabase/supabase-js";

export interface AuthenticationStoreModel {
  user: User | null;
  isLoading: boolean;
}
