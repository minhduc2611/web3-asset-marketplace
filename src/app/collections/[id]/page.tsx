"use client";
import CardRegisterModal from "@/components/card-reviewer/CardRegisterModal";
import CardReviewer from "@/components/card-reviewer/CardReviewer";
import { Icons } from "@/components/common/icons";
import useFlashCardViewer from "@/hooks/flash-cards-collection/useFlashCardViewer";
import Link from "next/link";

import { filterAndSortDueCards } from "@/helpers/flashcard";
import timeUtils from "@/helpers/timeUtils";
import { cn } from "@/lib/utils";
import { Button } from "primereact/button";
import { use, useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";

const Debugger = ({ onClose }: { onClose: () => void }) => {
  const [index, setIndex] = useState(0);
  const { deckInfo } = useFlashCardViewer();

  const final =
    index === 0 ? deckInfo.hasReviewTimeCards : deckInfo.noReviewTimeCards;
  const styles = {
    cardTab:
      "text-center font-semibold p-2 border-b border-gray-300 cursor-pointer bg-slate-100",
    active: "bg-slate-400",
  };
  return (
    <div className="absolute top-0 left-0 bg-slate-200 z-50 w-full h-[85%] overflow-scroll">
      <div className="sticky top-2 h-[80px] flex justify-between p-2">
        <div>
          <span
            className={cn(styles.cardTab, index === 0 && styles.active)}
            onClick={() => setIndex(0)}
          >
            Reviewing Cards
          </span>
          <span
            className={cn(styles.cardTab, index === 1 && styles.active)}
            onClick={() => setIndex(1)}
          >
            Not Reviewed Cards
          </span>
        </div>
        <span className="h-4 w-4 cursor-pointer m-2" onClick={onClose}>
          <Icons.close />
        </span>
      </div>
      <div className="">
        {final.map((card, index) => {
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
                    .diff(timeUtils.dayjs(), "hours");
                  // get relative due time
                  const relativeTime = timeUtils
                    .dayjs(userCardData.next_review_time)
                    .fromNow();
                  const colorClass =
                    timeDiff < 0
                      ? "text-red-600"
                      : timeDiff === 0
                      ? "text-green-600"
                      : "text-blue-600";

                  const message = timeDiff < 0 ? "Overdue" : "Upcoming";
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
      </div>
    </div>
  );
};
export default function Home({ params }: { params: { id: string } }) {
  const [showCardList, setShowCardList] = useState(false);

  const {
    deckInfo,
    flashCardMap,
    newCardReviewedToday,
    getFlashCards,
    resetFlashCards,
  } = useFlashCardViewer();

  const total = useMemo(
    () => Object.values(flashCardMap).length,
    [flashCardMap]
  );
  const totalDue = useMemo(
    () => deckInfo.hasReviewTimeCards.length,
    [deckInfo]
  );
  const totalNotDue = useMemo(
    () => deckInfo.noReviewTimeCards.length,
    [deckInfo]
  );

  useEffect(() => {
    Number.isInteger(Number(params?.id)) && getFlashCards(Number(params?.id));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-base-100 pt-4">
      {showCardList && <Debugger onClose={() => setShowCardList(false)} />}
      {/* <button className="absolute top-12 left-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        <Link href="/collections" onClick={resetFlashCards}>
          <Icons.chevronLeft />
        </Link>
      </button> */}
      <div className="w-full p-5">
        <div className="text-xl font-semibold text-primary text-center my-2 flex justify-between">
          <span
            className="flex gap-2 items-center"
            data-tooltip-id="newCardReviewedToday"
            data-tooltip-content="New Card Reviewed Today"
          >
            <Icons.checkCircle size={20} className="text-primary" />
            {newCardReviewedToday}/30
          </span>
          <Tooltip id="newCardReviewedToday" place={"top"} className="z-50" />
          <span className="flex gap-2">
            <span
              className="text-emerald-500 flex gap-2 items-center"
              data-tooltip-id="totalNotDue"
              data-tooltip-content="New Card"
            >
              <Icons.eye size={20} />
              {totalNotDue}
            </span>
            <Tooltip id="totalNotDue" place={"top"} className="z-50" />

            <span
              className="text-red-400 flex gap-2 items-center"
              data-tooltip-id="totalOverdue"
              data-tooltip-content={"Overdue"}
            >
              <Icons.clock size={20} />
              {totalDue}
            </span>
            <Tooltip id="totalOverdue" place={"top"} className="z-50" />
            <span
              className="flex gap-2 items-center"
              data-tooltip-id="total-flash-card"
              data-tooltip-content={"Total Cards"}
            >
              <Icons.layers size={20} /> {total}
            </span>
            <Tooltip id="total-flash-card" place={"top"} className="z-50" />
          </span>
        </div>
        <CardReviewer />
        <CardRegisterModal collectionId={Number(params?.id)} />
        <Button
          className={`border rounded-full p-2 absolute bottom-10 right-10 mt-5 ${
            showCardList ? "bg-blue-500 text-green-100" : ""
          }`}
          onClick={() => setShowCardList(!showCardList)}
        >
          <Icons.collections className="fill-primary-content stroke-primary" />
        </Button>
      </div>
    </main>
  );
}
