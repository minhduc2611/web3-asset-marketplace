"use client";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";

import CommonFlipCard from "@/components/common/common-flip-card/CommonFlipCard";
import { Difficulty } from "@/enum/difficulty";
import { calculateNextReviewTime } from "@/helpers/flashcard";
import { getFile } from "@/helpers/imageUtils";
import { size } from "@/helpers/listUtils";
import useFlashCardViewer from "@/hooks/flash-cards-collection/useFlashCardViewer";
import { FLASK_CARD_BUCKET } from "@/services/flashCard";
import { useMemo, useState } from "react";
import { Icons } from "../common/icons";

const Card = ({
  card,
  onNext,
}: {
  card: FlashCardModel;
  onNext: (flashcardId: number, difficulty: Difficulty) => void;
}) => {
  const [showDefinition, setShowDefinition] = useState(false);
  const [shouldNext, setShouldNext] = useState(false);

  const nextReviewTime = useMemo(() => {
    const userCardData = card.user_card_datas[0];
    const interval = userCardData?.interval || 1;
    const superEasy = calculateNextReviewTime(interval, Difficulty.SUPER_EASY);
    const easy = calculateNextReviewTime(interval, Difficulty.EASY);
    const medium = calculateNextReviewTime(interval, Difficulty.MEDIUM);
    const hard = calculateNextReviewTime(interval, Difficulty.HARD);
    console.log("nextReviewTime", {
      superEasy,
      easy,
      medium,
      hard,
    });
    return {
      [Difficulty.SUPER_EASY]: `${superEasy.timeDiffFromNow} ${superEasy.unit}`,
      [Difficulty.EASY]: `${easy.timeDiffFromNow} ${easy.unit}`,
      [Difficulty.MEDIUM]: `${medium.timeDiffFromNow} ${medium.unit}`,
      [Difficulty.HARD]: `${hard.timeDiffFromNow} ${hard.unit}`,
    } as Record<Difficulty, string>;
  }, [card.id]);

  const nameMap = {
    [Difficulty.SUPER_EASY]: "Super Easy",
    [Difficulty.EASY]: "Easy",
    [Difficulty.MEDIUM]: "Medium",
    [Difficulty.HARD]: "Hard",
  };
  return (
    <>
      <CommonFlipCard
        isFlipped={showDefinition}
        setIsFlipped={(value) => {
          setShowDefinition(value);
          setShouldNext(true);
        }}
        renderFrontCard={() => {
          return (
            <>
              <div dangerouslySetInnerHTML={{ __html: card.term || "" }}></div>
              {card.media_url && (
                <div className="">
                  <img
                    alt="src"
                    className="object-scale-down h-full m-auto max-h-[250px]"
                    src={getFile(FLASK_CARD_BUCKET, card.media_url)}
                  />
                </div>
              )}
            </>
          );
        }}
        renderBackCard={() => {
          return (
            <p className="text-gray-600 min-h-[200px] block">
              {showDefinition && (
                <div
                  className="mt-10"
                  dangerouslySetInnerHTML={{ __html: card.definition || "" }}
                ></div>
              )}
              <hr className="solid my-6" />
              {card.audio_url && (
                <div
                  className=" h-12 flex items-center justify-center rounded-lg"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const audio = new Audio(
                      getFile(FLASK_CARD_BUCKET, card.audio_url || "")
                    );
                    audio.play();
                  }}
                >
                  <Icons.volume2 className="cursor-pointer" />
                </div>
              )}
              <hr className="solid my-6" />
              <div dangerouslySetInnerHTML={{ __html: card.term || "" }}></div>
              {card.media_url && (
                <div className="">
                  <img
                    alt="src"
                    className="object-scale-down h-full m-auto max-h-[250px]"
                    src={getFile(FLASK_CARD_BUCKET, card.media_url)}
                  />
                </div>
              )}
            </p>
          );
        }}
      />
      <div className="grid grid-cols-2 gap-1 p-2">
        {/* map Difficulty */}
        {Object.keys(nextReviewTime).map((key) => {
          return (
            <div key={key}>
              <button
                className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300`}
                disabled={!shouldNext}
                onClick={() => {
                  setShowDefinition(false);
                  setShouldNext(false);
                  onNext(card.id, key as Difficulty);
                }}
              >
                {nameMap[key as Difficulty]}{" "}
                {`~${nextReviewTime[key as Difficulty]}`}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

const CardReviewer = () => {
  const {
    currentCardId,
    flashCardMap,
    getCurrentFlashCard,
    updateFlashCardNextReviewTime,
  } = useFlashCardViewer();

  const handleNext = async (flashcardId: number, difficulty: Difficulty) => {
    await updateFlashCardNextReviewTime(flashcardId, difficulty);
    getCurrentFlashCard();
  };

  return (
    <div className="flex flex-wrap justify-center">
      <div className={`card-wrapper w-full lg:w-[652px]`}>
        {/* <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <CommonProgressBar percentage={flashCardViewer.getPercentage()} />
        </div> */}
        {size(flashCardMap) > 0 && flashCardMap[currentCardId] && (
          <Card card={flashCardMap[currentCardId]} onNext={handleNext} />
        )}

        {size(flashCardMap) == 0 && (
          <h5 className="p-10">Please add a card to learn</h5>
        )}
      </div>
    </div>
  );
};

export default CardReviewer;
