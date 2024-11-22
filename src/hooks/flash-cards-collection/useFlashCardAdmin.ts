import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";
import { useMemo } from "react";

const useFlashCardAdmin = () => {
  const {
    values: { currentCardId, flashCardForm, flashCardMap, isAdminOpen },
    addOneFlashCard,
    updateOneFlashCard,
    deleteOneFlashCard,
    getFlashCards,
    resetFlashCards,
    setAdminModal,
    setValues,
    resetForm,
  } = useFlashCardRegisterStore();

  const formFields = {
    id: {
      name: "id",
    },
    term: {
      name: "term",
    },
    definition: {
      name: "definition",
    },
    media_url: {
      name: "media_url",
    },
    status: {
      name: "status",
    },
  };

  const editCard = (data?: FlashCardModel) => {
    let currentCard: FlashCardModel =
      data === undefined ? flashCardMap[currentCardId] : data;

    if (currentCard) {
      setValues({ flashCardForm: currentCard });
      setAdminModal(true);
    } else {
      throw new Error("card not found");
    }
  };

  const allCards = useMemo(() => {
    const cards = Object.values(flashCardMap).sort((a, b) => {
      // sort by latest created_at
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    return cards;
  }, [flashCardMap]);

  return {
    isAdminOpen,
    flashCards: allCards,
    flashCardForm,
    formFields,
    editCard,
    addOneFlashCard,
    updateOneFlashCard,
    deleteOneFlashCard,
    getFlashCards,
    resetFlashCards,
    setAdminModal,
    setValues,
    resetForm,
  };
};

export default useFlashCardAdmin;
