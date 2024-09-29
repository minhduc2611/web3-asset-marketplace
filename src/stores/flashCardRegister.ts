import FlashCardViewer from "@/classes/FlashCardViewer";
import { FormStatus } from "@/enum/common";
import { generateUniqueFileName } from "@/helpers/fileUtils";
import { zustandForm } from "@/lib/zustand-form";
import FlashCardService from "@/services/flashCard";
import FlashCardTransform from "@/transform/flashcard";

export interface FlashCardRegisterState {
  flashCardForm: FlashCardRegisterFormState;
  flashCardViewer: FlashCardViewer;
  isAdminOpen: boolean;
  currentIndex: number;
}

export interface FlashCardRegisterFormState {
  id?: number;
  term: string;
  definition: string;
  media_url: string;
  audio_file?: File;
  audio_url: string;
  status?: FormStatus;
  author_id: string | null;
}

interface Actions {
  addOneFlashCard: (collectionId: number, author_id: string) => void;
  updateOneFlashCard: (collectionId: number, author_id: string) => void;
  deleteOneFlashCard: (collectionId: number, id: number) => void;
  resetFlashCards: () => void;
  setAdminModal: (boo: boolean) => void;
  resetForm: () => void;
  getFlashCards: (collectionId: number) => void;
  updateCurrentIndex: (index: number) => void;
}

export const createInitialValues = () => {
  return {
    id: 0,
    term: "",
    definition: "",
    media_url: "",
    audio_url: "",
    status: FormStatus.Add,
    author_id: null,
  };
};
const defaultFlashCardViewer = () => new FlashCardViewer([]);

export const useFlashCardRegisterStore = zustandForm.create<
  FlashCardRegisterState,
  Actions
>({
  id: "flash-card-store",
  state: () => ({
    flashCardForm: createInitialValues(),
    flashCardViewer: defaultFlashCardViewer(),
    currentIndex: 0,
    isAdminOpen: false,
  }),
  actions: (set, get) => {
    const addOneFlashCard = async (collectionId: number, author_id: string) => {
      const { flashCardForm } = get();
      let audio_url = "";
      if (flashCardForm.audio_file) {
        const path2 = generateUniqueFileName(flashCardForm.audio_file!);
        const { data } = await FlashCardService.upload(
          path2,
          flashCardForm.audio_file!
        );
        audio_url = data?.path!;
      }

      const request = FlashCardTransform.flashCardFormStateToAddRequestModel(
        collectionId,
        { ...flashCardForm, author_id },
        audio_url || flashCardForm.audio_url || undefined
      );
      await FlashCardService.insertOne(request);
      collectionId && (await getFlashCards(collectionId));
      resetForm();
    };
    const updateCurrentIndex = (index: number) => {
      set({ currentIndex: index });
    };
    const updateOneFlashCard = async (
      collectionId: number,
      author_id: string
    ) => {
      const { flashCardForm } = get();
      let audio_url = "";

      if (flashCardForm.audio_file) {
        const path2 = generateUniqueFileName(flashCardForm.audio_file!);
        const { data } = await FlashCardService.upload(
          path2,
          flashCardForm.audio_file!
        );
        audio_url = data?.path!;
      }
      const request = FlashCardTransform.flashCardFormStateToUpdateRequestModel(
        collectionId,
        { ...flashCardForm, author_id },
        audio_url || flashCardForm.audio_url || undefined
      );

      // console.log("a", flashCardForm);
      console.log("request", request);
      await FlashCardService.updateOne(request);
      collectionId && (await updateFlashCards(collectionId));
      resetForm();
    };

    const getFlashCards = async (collectionId: number) => {
      const { data } = await FlashCardService.getAll(collectionId);
      data && set({ flashCardViewer: new FlashCardViewer(data) });
    };

    const updateFlashCards = async (collectionId: number) => {
      const { flashCardViewer } = get();
      const { data } = await FlashCardService.getAll(collectionId);
      if (data) {
        flashCardViewer.cards = data;
        // data && set({ flashCardViewer: new FlashCardViewer(data) });
      }
    };

    const deleteOneFlashCard = async (collectionId: number, id: number) => {
      await FlashCardService.deleteOne(id);
      collectionId && (await updateFlashCards(collectionId));
      resetForm();
    };

    const resetForm = () => {
      set({
        flashCardForm: createInitialValues(),
      });
    };

    const resetFlashCards = () => {
      set({
        flashCardViewer: defaultFlashCardViewer(),
      });
    };

    const setAdminModal = (boo: boolean) => {
      set({
        isAdminOpen: boo,
      });
    };

    return {
      addOneFlashCard,
      updateOneFlashCard,
      deleteOneFlashCard,
      resetForm: resetForm,
      getFlashCards,
      resetFlashCards,
      setAdminModal,
      updateCurrentIndex,
    };
  },
});
