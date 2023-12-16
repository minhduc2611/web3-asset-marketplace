"use client";
import CardRegisterModal from "@/components/card-reviewer/CardRegisterModal";
import CardReviewer from "@/components/card-reviewer/CardReviewer";
import { Icons } from "@/components/common/icons";
import { useFlashCardStoreActions } from "@/stores/flashCard";
import Link from "next/link";

import { useEffect } from "react";

export default function Home({ params }: { params: { id: string } }) {
  const { getFlashCards, resetFlashCards } = useFlashCardStoreActions();

  useEffect(() => {
    Number.isInteger(Number(params?.id)) && getFlashCards(Number(params?.id));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <button className="absolute top-2 left-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        <Link href="/collections" onClick={resetFlashCards}>
          <Icons.chevronLeft />
        </Link>
      </button>
      <div className="w-full">
        <h1 className="text-3xl font-semibold text-center my-8">Flashcards</h1>
        <CardReviewer />
      </div>
      <CardRegisterModal />
    </main>
  );
}
