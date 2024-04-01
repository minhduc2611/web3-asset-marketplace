"use client";

import { BrainLogList } from "@/components/brain-log/BrainLogList";
import { useBrainLogStoreActions } from "@/stores/brainLog";

import { useEffect } from "react";

export default function Home() {
  const { getBrainLogTypes } = useBrainLogStoreActions();

  useEffect(() => {
    getBrainLogTypes();
  }, []);

  return (
    <main className="min-h-screen p-10">
        <BrainLogList />
    </main>
  );
}
