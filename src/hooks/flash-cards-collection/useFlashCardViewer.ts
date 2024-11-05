import { filterAndSortDueCards } from "@/helpers/flashcard";
import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";
import { useMemo } from "react";

const useFlashCardViewer = () => {
  const {
    values: { flashCardMap, currentCardId, newCardReviewedToday, userSettings },
    getFlashCards,
    resetFlashCards,
    updateCurrentIndex,
    getCurrentFlashCard,
    updateFlashCardNextReviewTime,
  } = useFlashCardRegisterStore();

  const deckInfo = useMemo(
    () =>
      filterAndSortDueCards(Object.values(flashCardMap), {
        prioritizeNoReviewTimeCard: true,
      }),
    [currentCardId]
  );

  return {
    deckInfo,
    userSettings,
    flashCardMap,
    newCardReviewedToday,
    getFlashCards,
    resetFlashCards,
    currentCardId,
    updateCurrentIndex,
    getCurrentFlashCard,
    updateFlashCardNextReviewTime,
  };
};

export default useFlashCardViewer;
