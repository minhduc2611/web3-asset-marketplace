"use client";
import { publicRoutes } from "@/constants/public-routes";
import { useOnce } from "@/hooks/use-once";
import { getCurrentUser } from "@/lib/supabase";
import useAppState from "@/store/useAppState";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./pages/loading";
import ClientProvider from "./client-provider";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { setUser, appLoading, setAppLoading } = useAppState();
  const router = useRouter();
  const pathname = usePathname();

  const getUser = async () => {
    setAppLoading(true);
    const _user = await getCurrentUser();

    if (!_user && !publicRoutes.includes(pathname)) {
      router.push("/login");
    }

    setUser(_user);
    setAppLoading(false);
  };

  useOnce(() => {
    getUser();
  }, []);

  if (appLoading) {
    return <Loading />;
  }

  return <ClientProvider>{children}</ClientProvider>;
}
