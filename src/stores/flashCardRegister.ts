import { FormStatus } from "@/enum/common";
import { Difficulty } from "@/enum/difficulty";
import { getAuthenticatedUserId } from "@/helpers/auth";
import { generateUniqueFileName } from "@/helpers/fileUtils";
import {
  calculateNextReviewTime,
  filterAndSortDueCards,
} from "@/helpers/flashcard";
import timeUtils from "@/helpers/timeUtils";
import { zustandForm } from "@/lib/zustand-form";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { initUserCardDataModel } from "@/models/user-card-data/userCardDataModel";
import FlashCardService from "@/services/flashCard";
import UserCardDataService from "@/services/userCardData";

import { handleError } from "@/lib/utils";
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
  newCardReviewedToday: number;
  userSettings: {
    newCardADay: number;
  }
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
    newCardReviewedToday: 0,
    userSettings: {
      newCardADay: 30, // todo: get from user settings
    }
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
      const res = await FlashCardService.insertOne(request);
      handleError(res, {
        successMessage: "Flashcard added successfully",
        successCallback: async () => {
          collectionId && (await getFlashCards(collectionId));
          resetForm();
        },
      });
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

      const res = await FlashCardService.updateOne(request);
      handleError(res, {
        successMessage: "Flashcard updated successfully",
        successCallback: async () => {
          collectionId && (await updateFlashCards(collectionId));
          resetForm();
        },
      });
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
      const res = await FlashCardService.deleteOne(id);
      handleError(res, {
        successMessage: "Flashcard deleted successfully",
        successCallback: async () => {
          collectionId && (await updateFlashCards(collectionId));
          resetForm();
        },
      });
    };
    const resetForm = () => {
      set({
        flashCardForm: createInitialValues(),
      });
    };
    const resetFlashCards = () => {
      set({
        flashCardMap: {},
        cardReviewed: 0,
        currentCardId: 0,
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
      const dueCards = filterAndSortDueCards(cards, {
        prioritizeNoReviewTimeCard: Math.random() < 0.3,
      }).result;
      console.log("dueCards", dueCards);
      if (dueCards.length === 0) return;
      set({ currentCardId: dueCards[0].id });
    };

    const updateNewCardReviewedToday = () => {
      set({ newCardReviewedToday: get().newCardReviewedToday + 1 });
    }
    // update flashcard next review time
    const updateFlashCardNextReviewTime = async (
      flashcardId: number,
      difficulty: Difficulty
    ) => {
      const { flashCardMap } = get();
      const currentCard = flashCardMap[flashcardId];

      if (!currentCard.next_review_time) {
        updateNewCardReviewedToday();
      }

      const userCardData =
        currentCard.user_card_datas[0] ||
        initUserCardDataModel(getAuthenticatedUserId() || "", currentCard.id);
      const interval = userCardData.interval || 1;

      // Base interval multiplier logic
      const { newInterval, nextReviewTime } = calculateNextReviewTime(
        interval,
        difficulty
      );
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
