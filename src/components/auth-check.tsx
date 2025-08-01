"use client";
import { publicRoutes } from "@/constants/public-routes";
import authService from "@/lib/auth-service";
import useAppState from "@/store/useAppState";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./pages/loading";
import ClientProvider from "./client-provider";
import { useEffect } from "react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { setUser, appLoading, setAppLoading } = useAppState();
  const router = useRouter();
  const pathname = usePathname();

  const getUser = async () => {
    console.log("🎯 >>>>>>>>> getUser");
    setAppLoading(true);
    
    // First check if we have a valid authenticated user
    const localUser = authService.getCurrentUser();
    if (localUser && authService.isAuthenticated()) {
      setUser(localUser);
      setAppLoading(false);
      return;
    }

    // If no local user or not authenticated, try to verify with the backend
    const verifyResult = await authService.verifyToken();
    if (verifyResult.success && verifyResult.data) {
      setUser(verifyResult.data);
      setAppLoading(false);
      return;
    }

    // No valid user found
    setUser(null);
    
    // Redirect to login if on a protected route
    if (!publicRoutes.includes(pathname)) {
      router.push("/login");
    }
    
    setAppLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (appLoading) {
    return <Loading />;
  }

  return <ClientProvider>{children}</ClientProvider>;
}
