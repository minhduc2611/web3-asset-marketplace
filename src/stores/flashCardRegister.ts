import FlashCardViewer from "@/classes/FlashCardViewer";
import { FormStatus } from "@/enum/common";
import { Difficulty } from "@/enum/difficulty";
import { getAuthenticatedUserId } from "@/helpers/auth";
import { generateUniqueFileName } from "@/helpers/fileUtils";
import { filterAndSortDueCards } from "@/helpers/flashcard";
import timeUtils from "@/helpers/timeUtils";
import { zustandForm } from "@/lib/zustand-form";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { initUserCardDataModel } from "@/models/user-card-data/userCardDataModel";
import FlashCardService from "@/services/flashCard";
import UserCardDataService from "@/services/userCardData";
import {
  arrayToMap,
  flashCardFormStateToAddRequestModel,
  flashCardFormStateToUpdateRequestModel,
} from "@/transform/flashcard";

export interface FlashCardRegisterState {
  flashCardForm: FlashCardRegisterFormState;
  // flashCardViewer: FlashCardViewer;
  flashCardMap: { [key: number]: FlashCardModel };
  isAdminOpen: boolean;
  currentCardId: number;
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
  getCurrentFlashCard: () => void;
  updateFlashCardNextReviewTime: (
    index: number,
    difficulty: Difficulty
  ) => void;
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

export const useFlashCardRegisterStore = zustandForm.create<
  FlashCardRegisterState,
  Actions
>({
  id: "flash-card-store",
  state: () => ({
    flashCardForm: createInitialValues(),
    flashCardMap: {},
    currentCardId: 0,
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

      const request = flashCardFormStateToAddRequestModel(
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
      const request = flashCardFormStateToUpdateRequestModel(
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
      data && set({ flashCardMap: arrayToMap(data) });
      getCurrentFlashCard();
    };
    const updateFlashCards = async (collectionId: number) => {
      const { data } = await FlashCardService.getAll(collectionId);
      if (data) {
        data && set({ flashCardMap: arrayToMap(data) });
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
        flashCardMap: {},
      });
    };
    const setAdminModal = (boo: boolean) => {
      set({
        isAdminOpen: boo,
      });
    };
    // get current flashcard
    const getCurrentFlashCard = () => {
      const { flashCardMap } = get();
      const cards = Object.values(flashCardMap);
      const dueCards = filterAndSortDueCards(cards, Math.random() < 0.3);
      set({ currentCardId: dueCards[0].id });
    };
    // update flashcard next review time
    const updateFlashCardNextReviewTime = async (
      flashcardId: number,
      difficulty: Difficulty
    ) => {
      const { flashCardMap } = get();
      const currentCard = flashCardMap[flashcardId];
      const userCardData =
        currentCard.user_card_datas[0] ||
        initUserCardDataModel(getAuthenticatedUserId() || "", currentCard.id);
      const interval = userCardData.interval || 1;
      const currentTime = new Date();
      let newInterval: number;

      // Base interval multiplier logic
      switch (difficulty) {
        case Difficulty.SUPER_EASY:
          newInterval = interval < 1000 ? 1440 : interval * 2; // Double the previous interval if less than 1000
          break;
        case Difficulty.EASY:
          newInterval = interval * 2; // Double the previous interval
          break;
        case Difficulty.MEDIUM:
          newInterval = interval; // Keep the same interval
          break;
        case Difficulty.HARD:
          newInterval = interval / 2; // Halve the previous interval
          break;
        default:
          newInterval = interval; // Keep the same interval
          break;
      }

      // Calculate next review time
      const nextReviewTime = timeUtils
        .dayjs(currentTime)
        .add(newInterval, "minute")
        .format("YYYY-MM-DD HH:mm:ss");

      // Update user card data
      userCardData.interval = newInterval;
      userCardData.next_review_time = nextReviewTime;
      //
      const result = await UserCardDataService.upsertOne(userCardData);

      // Update flashcard
      currentCard.user_card_datas = result.data || [];
      flashCardMap[flashcardId] = currentCard;
      set({ flashCardMap });
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
      //
      getCurrentFlashCard,
      updateFlashCardNextReviewTime,
    };
  },
});
