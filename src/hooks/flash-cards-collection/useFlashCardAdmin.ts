import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";

const useFlashCardAdmin = () => {
  const {
    values: { flashCardForm, flashCardViewer, isAdminOpen },
    addOneFlashCard,
    updateOneFlashCard,
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
      data === undefined
        ? flashCardViewer.cards[flashCardViewer.currentIndex]
        : data;

    if (currentCard) {
      setValues({ flashCardForm: currentCard });
      setAdminModal(true);
    } else {
      throw new Error("card not found");
    }
  };

  return {
    isAdminOpen,
    flashCards: flashCardViewer.cards,
    flashCardForm,
    formFields,
    editCard,
    addOneFlashCard,
    updateOneFlashCard,
    getFlashCards,
    resetFlashCards,
    setAdminModal,
    setValues,
    resetForm,
  };
};

export default useFlashCardAdmin;
