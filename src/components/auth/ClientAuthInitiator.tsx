"use client";
import useTheme from "@/hooks/useTheme";
import { useClientAuthStore } from "@/stores/authentication";
import { User } from "@supabase/supabase-js";
import { FC, PropsWithChildren, useEffect } from "react";

type Props = PropsWithChildren<{
  user: User;
}>;
export const ClientAuthInitiator: FC<Props> = ({ user, children }) => {
  const { user: stateUser, setUserFromServer } = useClientAuthStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setUserFromServer(user);
    setTheme(theme);

  }, [user.id, theme]);

  if (!stateUser) {
    return null;
  }
  return <>{children}</>;
};
export default ClientAuthInitiator;
