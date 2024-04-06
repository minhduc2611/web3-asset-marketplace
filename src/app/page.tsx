"use client";
import { useClientAuthStore } from "@/stores/authentication";
import "dayjs/locale/en";
import Link from "next/link";
import ReactTypingEffect from "react-typing-effect";
import { twMerge } from "tailwind-merge";
import { isMobile, isTablet } from "react-device-detect";

export default function Home() {
  const { user } = useClientAuthStore();
  return (
    <main
      className={twMerge(
        "flex min-h-screen items-center justify-center gap-52 p-10 md:p-20 h-full bg-gray-800 text-gray-100"
      )}
    >
      <div
        className={
          (twMerge("text-center"),
          isMobile || isTablet ? "text-[3rem]" : "text-[6rem]")
        }
      >
        <p>We build</p>
        <p>Something</p>
        <ReactTypingEffect
          text={["Extraordinary", "Robust", "Extremely Fast"]}
        />
      </div>
      {!user && (
        <Link href="/login" className="fixed top-10 right-10 text-gray-100">
          Join us
        </Link>
      )}
    </main>
  );
}
