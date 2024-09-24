"use client";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";

import CommonFlipCard from "@/components/common/common-flip-card/CommonFlipCard";
import CommonProgressBar from "@/components/common/common-progress-bar";
import { Difficulty } from "@/enum/difficulty";
import { getImage } from "@/helpers/imageUtils";
import useFlashCardViewer from "@/hooks/flash-cards-collection/useFlashCardViewer";
import { useState } from "react";

const Card = ({
  card,
  onNext,
}: {
  card: FlashCardModel;
  onNext: (difficulty: Difficulty) => void;
}) => {
  const [showDefinition, setShowDefinition] = useState(false);
  const [shouldNext, setShouldNext] = useState(false);
  const [stringModal, setStringModal] = useState("");

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
            <div dangerouslySetInnerHTML={{ __html: card.term || "" }}></div>
          );
        }}
        renderBackCard={() => {
          return (
            <p className="text-gray-600 min-h-[200px] block">
              <div dangerouslySetInnerHTML={{ __html: card.term || "" }}></div>
              {card.media_url && (
                <div className="m-auto h-[200px]">
                  <img
                    alt="src"
                    className="object-scale-down h-full m-auto"
                    src={getImage(card.media_url)}
                  />
                </div>
              )}
              <hr className="solid my-6" />
              {showDefinition && (
                <div
                  className="mt-10"
                  dangerouslySetInnerHTML={{ __html: card.definition || "" }}
                ></div>
              )}
            </p>
          );
        }}
      />
      <div className="flex justify-center gap-1">
        {/* {stringModal} | {card.definition} | */}
        {/* {stringModal && card.definition?.includes(stringModal) ? 't': 'f'}
        <input value={stringModal} onChange={e => setStringModal(e.target.value)} /> */}
        <button
          disabled={!shouldNext}
          className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            setShouldNext(false);
            onNext(Difficulty.SUPER_EASY);
          }}
        >
          Super Easy {"~1d"}
        </button>
        <button
          disabled={!shouldNext}
          className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            setShouldNext(false);
            onNext(Difficulty.EASY);
          }}
        >
          Easy {"~12min"}
        </button>
        <button
          disabled={!shouldNext}
          className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            onNext(Difficulty.MEDIUM);
            setShouldNext(false);
          }}
        >
          Medium {"~9min"}
        </button>
        <button
          disabled={!shouldNext}
          className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            onNext(Difficulty.HARD);
            setShouldNext(false);
          }}
        >
          Hard {"~2min"}
        </button>
      </div>
    </>
  );
};

const CardReviewer = () => {
  const { currentIndex, flashCardViewer, updateCurrentIndex } = useFlashCardViewer();
  // const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNext = async (difficulty: Difficulty) => {
    await flashCardViewer?.updateCard(currentIndex, difficulty);
    updateCurrentIndex(flashCardViewer?.getNextIndexToView() || 0);

  };

  return (
    <div className="flex flex-wrap justify-center">
      <div className={`card-wrapper w-full lg:w-[652px]`}>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <CommonProgressBar percentage={flashCardViewer.getPercentage()} />
        </div>
        {flashCardViewer.cards.length > 0 && (
          <Card
            card={flashCardViewer.cards[currentIndex]}
            onNext={handleNext}
          />
        )}
        {flashCardViewer.cards.length == 0 && (
          <h5 className="p-10">Please add a card to learn</h5>
        )}
      </div>
    </div>
  );
};

export default CardReviewer;
