"use client";
import CardRegisterModal from "@/components/card-reviewer/CardRegisterModal";
import CardReviewer from "@/components/card-reviewer/CardReviewer";
import { Icons } from "@/components/common/icons";
import useFlashCardViewer from "@/hooks/flash-cards-collection/useFlashCardViewer";
import Link from "next/link";

import timeUtils from "@/helpers/timeUtils";
import { useRerender } from "@lilib/hooks";
import { useEffect } from "react";

const Debugger = () => {
  const { currentIndex, flashCardViewer, getFlashCards, resetFlashCards } = useFlashCardViewer();
  return (
    <div className="absolute top-0 left-0 bg-slate-200 z-50 w-[500px] h-[80%] overflow-scroll">
      {currentIndex}
      {/* <pre>
        {JSON.stringify(flashCardViewer, null, 2)}
        </pre>  */}
        {flashCardViewer.cards
        
        // sort by next_review_time
        .sort((a, b) => {
          // new Date(a.next_review_time).getTime() - new Date(b.next_review_time).getTime()
          const dateA = a.next_review_time ? new Date(a.next_review_time).getTime(): 0;
          const dateB = b.next_review_time ? new Date(b.next_review_time).getTime(): 0;
          return dateA - dateB;
        })
        .map((card, index) => {
          return (
            <div key={index} className="p-4 border-b border-gray-300">
              <div dangerouslySetInnerHTML={{ __html: card.term || "" }}></div>
              <p className="text-blue-700">{timeUtils.dayjs(card.next_review_time).format("YYYY-MM-DD HH:mm:ssZ[Z]")}</p>
              <p>{card.interval}</p>
            </div>
          );
        })}
      {/* <JsonViewer value={flashCardViewer} /> */}
    </div>
  );
}
export default function Home({ params }: { params: { id: string } }) {
  const { getFlashCards, resetFlashCards } = useFlashCardViewer();

  useEffect(() => {
    Number.isInteger(Number(params?.id)) && getFlashCards(Number(params?.id));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">

        <Debugger />
      <button className="absolute top-2 left-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        <Link href="/collections" onClick={resetFlashCards}>
          <Icons.chevronLeft />
        </Link>
      </button>
      <div className="w-full p-5">
        <h1 className="text-3xl font-semibold text-center my-8">Flashcards</h1>
        <CardReviewer />
        <CardRegisterModal collectionId={Number(params?.id)} />
      </div>
    </main>
  );
}
