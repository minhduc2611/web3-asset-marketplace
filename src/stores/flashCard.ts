import FlashCardViewer from "@/classes/FlashCardViewer";
import {
  FlashCardAddRequestModel,
  FlashCardUpdateRequestModel,
} from "@/models/flash-card/flashCardRequestModel";
import {
  FlashCardStoreModel
} from "@/models/flash-card/flashCardStoreModel";
import FlashCardService from "@/services/flashCard";

import { create } from "zustand";

interface Methods {
  getFlashCards: (collectionId: number) => void;
  addOneFlashCard: (flashCard: FlashCardAddRequestModel) => void;
  updateOneFlashCard: (flashCard: FlashCardUpdateRequestModel) => void;
  setAdminModal: (open: boolean) => void;
  resetFlashCards: () => void;
}
const defaultFlashCardViewer  = () => new FlashCardViewer([])

export const useFlashCardStore = create<FlashCardStoreModel & Methods>(
  (set) => {
    const getFlashCards = async (collectionId: number) => {
      const { data } = await FlashCardService.getAll(collectionId);
      data &&
        set((state) => ({
          ...state,
          flashCardViewer: new FlashCardViewer(data),
        }));
    };
    const addOneFlashCard = async (flashCard: FlashCardAddRequestModel) => {
      await FlashCardService.insertOne(flashCard);
      flashCard.collection_id && (await getFlashCards(flashCard.collection_id));
    };

    const updateOneFlashCard = async (
      flashCard: FlashCardUpdateRequestModel
    ) => {
      await FlashCardService.updateOne(flashCard);
      flashCard.collection_id && (await getFlashCards(flashCard.collection_id));
    };
    
    const setAdminModal = async (open: boolean) => {
      set((state) => ({ ...state, isAdminOpen: open }));
    };

    const resetFlashCards = () => {
      set((state) => ({
        ...state,
        flashCardViewer: defaultFlashCardViewer(),
      }));
    };
 
    return {
      flashCardViewer: defaultFlashCardViewer(),
      isAdminOpen: false,
      getFlashCards,
      addOneFlashCard,
      updateOneFlashCard,
      setAdminModal,
      resetFlashCards
    };
  }
);
