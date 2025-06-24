import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { signOut as supabaseSignOut } from "@/lib/supabase";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  appLoading: boolean;
  setAppLoading: (appLoading: boolean) => void;
  signOut: () => void;
}

const useAppState = create<AppState>((set) => {
  return {
    user: null,
    appLoading: false,
    setUser: (user) => set({ user }),
    setAppLoading: (appLoading) => set({ appLoading }),
    signOut: () => {
      set({ user: null });
      supabaseSignOut();
    },
  };
});

export default useAppState;
