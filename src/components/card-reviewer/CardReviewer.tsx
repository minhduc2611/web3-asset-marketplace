"use client";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { useFlashCardStoreValue } from "@/stores/flashCard";

import CommonFlipCard from "@/components/common/common-card/CommonFlipCard";
import { useState } from "react";
import { getImage } from "@/helpers/imageUtils";

const CARD_SIZE = '682px'

const Card = ({
  card,
  onNext,
}: {
  card: FlashCardModel;
  onNext: () => void;
}) => {
  const [showDefinition, setShowDefinition] = useState(false);
  const [shouldNext, setShouldNext] = useState(false);

  return (
    <div className={`card-wrapper w-full lg:w-[652px] p-5`}>
      <CommonFlipCard
        isFlipped={showDefinition}
        setIsFlipped={(value) => {
          setShowDefinition(value);
          setShouldNext(true);
        }}
        renderFrontCard={() => {
          return <h2 className="p-14 text-xl font-semibold">{card.term}</h2>;
        }}
        renderBackCard={() => {
          return (
            <p className="mt-2 text-gray-600 min-h-[200px] block">
              <h2 className="text-xl font-semibold">{card.term}</h2>
              {card.media_url && (
                <div className="m-auto h-[200px]">
                  <img
                    alt="src"
                    className="object-scale-down h-full m-auto"
                    src={getImage(card.media_url)}
                  />
                </div>
              )}
              <hr className="solid" />
              {/* todo: Image */}
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
        <button
          disabled={!shouldNext}
          className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            setShouldNext(false);
            onNext();
          }}
        >
          Easy {">"}
        </button>
        <button
          disabled={!shouldNext}
          className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            onNext();
            setShouldNext(false);
          }}
        >
          Medium {">"}
        </button>
        <button
          disabled={!shouldNext}
          className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            onNext();
            setShouldNext(false);
          }}
        >
          Hard {">"}
        </button>
      </div>
    </div>
  );
};

const CardReviewer = () => {
  const { flashCards } = useFlashCardStoreValue();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashCards.length);
  };

  return (
    <div className="flex flex-wrap justify-center">
      {flashCards.length > 0 && (
        <Card card={flashCards[currentCardIndex]} onNext={handleNext} />
      )}
      {flashCards.length == 0 && (
        <h5 className="p-10">Please add a card to learn</h5>
      )}
    </div>
  );
};

export default CardReviewer;
