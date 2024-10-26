import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";

const useFlashCardViewer = () => {
  const {
    values: { flashCardMap, currentCardId, cardReviewed },
    getFlashCards,
    resetFlashCards,
    updateCurrentIndex,
    getCurrentFlashCard,
    updateFlashCardNextReviewTime,
  } = useFlashCardRegisterStore();
  return {
    flashCardMap,
    cardReviewed,
    getFlashCards,
    resetFlashCards,
    currentCardId,
    updateCurrentIndex,
    getCurrentFlashCard,
    updateFlashCardNextReviewTime,
  };
};

export default useFlashCardViewer;
