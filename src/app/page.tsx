"use client";
import { cn } from "@/lib/utils";
import { useClientAuthStore } from "@/stores/authentication";
import "dayjs/locale/en";
import Link from "next/link";
import { useDeviceSelectors } from "react-device-detect";
import ReactTypingEffect from "react-typing-effect";

export default function Home() {
  const { user } = useClientAuthStore();
  const [selectors] = useDeviceSelectors(
    typeof window !== undefined ? window.navigator.userAgent : ""
  );

  const { isMobile } = selectors;
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
          isMobile ? "text-[2.5rem]" : "text-[6rem]"
        )}
      >
        <p>We build</p>
        <p>Something</p>
        <ReactTypingEffect
          text={["Extraordinary", "Robust", "Extremely Fast"]}
        />
      </div>
    </main>
  );
}
