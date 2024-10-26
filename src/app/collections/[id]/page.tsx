"use client";
import CardRegisterModal from "@/components/card-reviewer/CardRegisterModal";
import CardReviewer from "@/components/card-reviewer/CardReviewer";
import { Icons } from "@/components/common/icons";
import useFlashCardViewer from "@/hooks/flash-cards-collection/useFlashCardViewer";
import Link from "next/link";

import timeUtils from "@/helpers/timeUtils";
import { Button } from "primereact/button";
import { useEffect, useMemo, useState } from "react";
import { filterAndSortDueCards } from "@/helpers/flashcard";

const Debugger = () => {
  const { flashCardMap, currentCardId } = useFlashCardViewer();
  const cards = useMemo(() => filterAndSortDueCards(Object.values(flashCardMap), true), [currentCardId]);
  return (
    <div className="absolute top-0 left-0 bg-slate-200 z-50 w-full h-[85%] overflow-scroll">
      {cards.map((card, index) => {
        return (
          <div key={index} className="p-4 border-b border-gray-300">
            <div
              className="bg-slate-400 rounded-sm border p-3"
              dangerouslySetInnerHTML={{ __html: card.term || "" }}
            ></div>
            <p className="text-blue-700">
              - card_id: {card.id} | collection_id: {card.collection_id}
            </p>
            <p>
              {card.user_card_datas.map((userCardData) => {
                const timeDiff = timeUtils
                  .dayjs(userCardData.next_review_time)
                  .diff(timeUtils.dayjs(), "days");
                // get relative due time
                const relativeTime = timeUtils
                  .dayjs(userCardData.next_review_time)
                  .fromNow();
                console.log("timeDiff", timeDiff);
                const colorClass =
                  timeDiff < 0
                    ? "text-red-600"
                    : timeDiff === 0
                    ? "text-green-600"
                    : "text-blue-600";

                const message = timeDiff < 0 ? "Overdue" : "Upcoming in";
                return (
                  <>
                    <p>
                      Next review time:{" "}
                      {timeUtils
                        .dayjs(userCardData.next_review_time)
                        .format("YYYY-MM-DD HH:mm:ssZ")}
                    </p>
                    <p className={colorClass}>
                      {message} {relativeTime}
                    </p>
                  </>
                );
              })}
            </p>
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
        <Button
          className={`border rounded-full p-2 absolute bottom-10 right-10 mt-5 ${
            showCardList ? "bg-blue-500 text-green-100" : ""
          }`}
          onClick={() => setShowCardList(!showCardList)}
        >
          <Icons.collections />
        </Button>
      </div>
    </main>
  );
}
