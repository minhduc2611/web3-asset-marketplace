import { AuthenticationStoreModel } from "@/models/authentication/authenticationStoreModel";
import superbaseInstance from "@/services/instances/superbaseInstance";
import { User } from "@supabase/supabase-js";
import { useMemo } from "react";

import { create } from "zustand";

interface Methods {
  setUserFromServer: (user: User) => void;
  getUser: () => void;
  logout: () => void;
  signUp: (payload: { email: string; password: string }) => void;
  signInWithPassword: (payload: { email: string; password: string }) => void;
}

export const useClientAuthStore = create<AuthenticationStoreModel & Methods>(
  (set) => {
    const getUser = async () => {
      set({ isLoading: true });
      const {
        data: { user },
      } = await superbaseInstance.getInstance().auth.getUser();
      set({ user, isLoading: false });
    };
    const logout = async () => {
      await superbaseInstance.getInstance().auth.signOut();
      set({ user: null });
    };
    const signUp = async (payload: { email: string; password: string }) => {
      const { email, password } = payload;

      const res = await superbaseInstance.getInstance().auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (res.error) {
        throw new Error(res.error.message);
      }
      if (!res.data.user) {
        return;
      }
    };

    const signInWithPassword = async (payload: {
      email: string;
      password: string;
    }) => {
      set({ isLoading: true });
      const { email, password } = payload;
      const res = await superbaseInstance
        .getInstance()
        .auth.signInWithPassword({
          email,
          password,
        });
      if (res.error) {
        set({ isLoading: false });
        throw new Error(res.error.message);
      }
      if (!res.data.user) {
        set({ isLoading: false });
        return;
      }
      set({ user: res.data.user, isLoading: false });
    };

    const setUserFromServer = async (user: User) => {
      set({ user });
    };

    return {
      user: null,
      isLoading: false,
      getUser,
      logout,
      signUp,
      signInWithPassword,
      setUserFromServer,
    };
  }
);
