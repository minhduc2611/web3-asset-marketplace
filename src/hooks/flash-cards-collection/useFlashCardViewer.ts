import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";

const useFlashCardViewer = () => {
  const {
    values: { flashCardMap, currentCardId },
    getFlashCards,
    resetFlashCards,
    updateCurrentIndex,
    getCurrentFlashCard,
    updateFlashCardNextReviewTime,
  } = useFlashCardRegisterStore();
  return {
    flashCardMap,
    getFlashCards,
    resetFlashCards,
    currentCardId,
    updateCurrentIndex,
    getCurrentFlashCard,
    updateFlashCardNextReviewTime,
  };
};

export default useFlashCardViewer;
