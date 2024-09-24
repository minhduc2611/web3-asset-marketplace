"use client";
import CardRegisterModal from "@/components/card-reviewer/CardRegisterModal";
import CardReviewer from "@/components/card-reviewer/CardReviewer";
import { Icons } from "@/components/common/icons";
import useFlashCardViewer from "@/hooks/flash-cards-collection/useFlashCardViewer";
import Link from "next/link";

import timeUtils from "@/helpers/timeUtils";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

const Debugger = () => {
  const { currentIndex, flashCardViewer } = useFlashCardViewer();
  return (
    <div className="absolute top-0 left-0 bg-slate-200 z-50 w-full h-[85%] overflow-scroll">
      <p className="hidden">{currentIndex}</p>
      {/* <pre>
        {JSON.stringify(flashCardViewer, null, 2)}
        </pre>  */}
      {flashCardViewer.cards

        // sort by next_review_time
        .sort((a, b) => {
          // new Date(a.next_review_time).getTime() - new Date(b.next_review_time).getTime()
          const dateA = a.next_review_time
            ? new Date(a.next_review_time).getTime()
            : 0;
          const dateB = b.next_review_time
            ? new Date(b.next_review_time).getTime()
            : 0;
          return dateA - dateB;
        })
        .map((card, index) => {
          return (
            <div key={index} className="p-4 border-b border-gray-300">
              <div
                className="bg-slate-400 rounded-sm border p-3"
                dangerouslySetInnerHTML={{ __html: card.term || "" }}
              ></div>
              <p className="text-blue-700">
                - Next review:{" "}
                {timeUtils
                  .dayjs(card.next_review_time)
                  .format("YYYY-MM-DD HH:mm:ssZ[Z]")}
              </p>
              <p>- Interval: {card.interval}</p>
            </div>
          );
        })}
      {/* <JsonViewer value={flashCardViewer} /> */}
    </div>
  );
};
export default function Home({ params }: { params: { id: string } }) {
  const [showCardList, setShowCardList] = useState(false);

  const { getFlashCards, resetFlashCards } = useFlashCardViewer();

  useEffect(() => {
    Number.isInteger(Number(params?.id)) && getFlashCards(Number(params?.id));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {showCardList && <Debugger />}
      <button className="absolute top-2 left-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        <Link href="/collections" onClick={resetFlashCards}>
          <Icons.chevronLeft />
        </Link>
      </button>
      <div className="w-full p-5">
        <h1 className="text-3xl font-semibold text-center my-8">Flashcards</h1>
        <CardReviewer />
        <CardRegisterModal collectionId={Number(params?.id)} />
        <Button className={`border rounded-full p-2 absolute bottom-10 right-10 mt-5 ${showCardList ? 'bg-blue-500 text-green-100' : ''}`} onClick={() => setShowCardList(!showCardList)}>
          <Icons.collections />
        </Button>
      </div>
    </main>
  );
}
