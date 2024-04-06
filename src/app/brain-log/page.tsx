"use client";

import { BrainLogList } from "@/components/brain-log/BrainLogList";
import { useClientAuthStore } from "@/stores/authentication";
import { useBrainLogStoreActions } from "@/stores/brainLog";
import { redirect } from "next/navigation";

import { useEffect } from "react";

export default function Home() {
  const { user } = useClientAuthStore();
  if(!user) {
    redirect("/login");
  }
  const { getBrainLogTypes } = useBrainLogStoreActions(user.id);

  useEffect(() => {
    console.log("getBrainLogTypes", user);
    if (user) {
      getBrainLogTypes(user?.id);
    }
  }, [user]);

  return (
    <main className="min-h-screen p-10">
      <BrainLogList />
    </main>
  );
}
