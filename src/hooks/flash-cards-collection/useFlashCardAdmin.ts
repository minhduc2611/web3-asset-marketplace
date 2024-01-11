import { useFlashCardStore } from "@/stores/flashCard";
import { useFlashCardRegisterStore } from "@/stores/flashCardRegister";

const useFlashCardAdmin = () => {
  const {
    flashCardViewer,
    isAdminOpen,
    addOneFlashCard,
    updateOneFlashCard,
    getFlashCards,
    resetFlashCards,
    setAdminModal,
  } = useFlashCardStore();

  const form = useFlashCardRegisterStore();

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

  return {
    isAdminOpen,
    flashCards: flashCardViewer.cards,
    addOneFlashCard,
    updateOneFlashCard,
    getFlashCards,
    resetFlashCards,
    setAdminModal,
    form,
    formFields
  };
};

export default useFlashCardAdmin;

/// form nằm ở 2 nơi ? edit cùng 1 form ?
// cái state mà form edit phải nằm ở store
