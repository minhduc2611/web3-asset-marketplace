import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";

const useFlashCardViewer = () => {
  const { values: {flashCardViewer}, getFlashCards, resetFlashCards } = useFlashCardRegisterStore();
  return { flashCardViewer, getFlashCards, resetFlashCards };
};

export default useFlashCardViewer;
