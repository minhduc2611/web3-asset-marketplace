"use client";
import { useClientAuthStore } from "@/stores/authentication";
import "dayjs/locale/en";
import Link from "next/link";
import ReactTypingEffect from "react-typing-effect";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const { user } = useClientAuthStore();
  return (
    <main className={twMerge("flex min-h-screen items-center justify-center gap-52 p-10 md:p-20 h-full bg-gray-800 text-gray-100")}>
      <div className="text-center">
        <p className="text-[6rem]">We build</p>
        <p className="text-[6rem]">Something</p>
        <ReactTypingEffect
          className="text-[6rem]"
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
