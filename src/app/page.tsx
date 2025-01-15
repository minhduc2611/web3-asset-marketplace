"use client";
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useClientAuthStore } from "@/stores/authentication";
import "dayjs/locale/en";
import Link from "next/link";

export default function Home() {
  const { user } = useClientAuthStore();
  const isMobile = useIsMobile();
  console.log("user", user);
  return (
    <main
      className={cn(
        "flex w-full min-h-screen items-center justify-center gap-52 p-10 md:p-20 h-full bg-base-100 text-primary"
      )}
    >
      {!user && (
        <Link
          href="/login"
          className={cn(
            "absolute text-gray-100 text-[1rem] rounded",
            isMobile ? "bottom-16 animate-pulse" : "top-10 right-10"
          )}
        >
          Join us
        </Link>
      )}
      <div
        className={cn(
          "text-center",
          "text-[2.5rem]",
          "md:text-[6rem]"
        )}
      >
        <p>We are rebuilding the app</p>
        <p>Please kindly wait</p>
      </div>
    </main>
  );
}
