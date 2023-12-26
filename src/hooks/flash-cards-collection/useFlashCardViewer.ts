import { useFlashCardStoreActions, useFlashCardStoreValue } from "@/stores/flashCard";

const useFlashCardViewer = () => {
    const { flashCardViewer } = useFlashCardStoreValue();
  const { getFlashCards, resetFlashCards } = useFlashCardStoreActions();

  return { flashCardViewer, getFlashCards, resetFlashCards };
};

export default useFlashCardViewer;
