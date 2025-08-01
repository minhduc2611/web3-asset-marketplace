import { AuthUser } from "@/types/auth";
import { create } from "zustand";
import authService from "@/lib/auth-service";

interface AppState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  appLoading: boolean;
  setAppLoading: (appLoading: boolean) => void;
  signOut: () => Promise<void>;
}

const useAppState = create<AppState>((set) => {
  return {
    user: null,
    appLoading: false,
    setUser: (user) => set({ user }),
    setAppLoading: (appLoading) => set({ appLoading }),
    signOut: async () => {
      set({ user: null });
      await authService.logout();
    },
  };
});

export default useAppState;
