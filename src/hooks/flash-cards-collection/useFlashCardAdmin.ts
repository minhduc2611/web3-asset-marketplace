import {
  useFlashCardStoreActions,
  useFlashCardStoreValue,
} from "@/stores/flashCard";

const useFlashCardAdmin = () => {
  const { flashCardViewer } = useFlashCardStoreValue();
  const {
    addOneFlashCard,
    updateOneFlashCard,
    getFlashCards,
    resetFlashCards,
  } = useFlashCardStoreActions();

  return {
    flashCards: flashCardViewer.cards,
    addOneFlashCard,
    updateOneFlashCard,
    getFlashCards,
    resetFlashCards,
  };
};

export default useFlashCardAdmin;
