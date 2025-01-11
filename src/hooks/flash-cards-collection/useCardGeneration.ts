import { filterAndSortDueCards } from "@/helpers/flashcard";
import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";
import { useMemo } from "react";

const useCardGeneration = () => {
  const {
    values: { generativeUrl, generativeFlashCards },
    getFlashCardFromGenerativeUrl,
    updateGenerativeUrl,
    createCardByGenerativeCards,
  } = useFlashCardRegisterStore();


  return {
    generativeUrl,
    generativeFlashCards,
    getFlashCardFromGenerativeUrl,
    updateGenerativeUrl,
    createCardByGenerativeCards
  };
};

export default useCardGeneration;
