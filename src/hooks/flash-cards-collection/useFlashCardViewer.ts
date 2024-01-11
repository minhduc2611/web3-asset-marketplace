import {
  useFlashCardStore
} from "@/stores/flashCard";

const useFlashCardViewer = () => {
  const { flashCardViewer, getFlashCards, resetFlashCards } = useFlashCardStore();
  return { flashCardViewer, getFlashCards, resetFlashCards };
};

export default useFlashCardViewer;
