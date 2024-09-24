import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";

const useFlashCardViewer = () => {
  const { values: {flashCardViewer, currentIndex} ,getFlashCards, resetFlashCards, updateCurrentIndex } = useFlashCardRegisterStore();
  return { flashCardViewer, getFlashCards, resetFlashCards, currentIndex, updateCurrentIndex };
};

export default useFlashCardViewer;
