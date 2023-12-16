import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { Builder } from "builder-pattern";
import ListUtils from "@/helpers/listUtils";
import { FlashCardStoreModel } from "@/models/flash-card/flashCardStoreModel";
import superbaseInstance from "@/services/superbaseInstance";
import FlashCardService from "@/services/flashCard";
import { FlashCardAddRequestModel, FlashCardUpdateRequestModel } from "@/models/flash-card/flashCardRequestModel";

export const FlashCardStore = atom<FlashCardStoreModel>({
  key: "flash-card",
  default: {
    flashCards: [],
  },
});

// Store actions should be here in store file
export function useFlashCardStoreActions() {
  const setFlashCardStore = useSetRecoilState(FlashCardStore);
  const resetFlashCards = () => {
    setFlashCardStore({ flashCards: [] });
  };
  const getFlashCards = async (collectionId: number) => {
    const { data } = await FlashCardService.getAll(collectionId);
    data && setFlashCardStore({ flashCards: data });
  };

  const addOneFlashCard = async (flashCard: FlashCardAddRequestModel) => {
    await FlashCardService.insertOne(flashCard);
    flashCard.collection_id && (await getFlashCards(flashCard.collection_id));
  };

  const updateOneFlashCard = async (flashCard: FlashCardUpdateRequestModel) => {
    await FlashCardService.updateOne(flashCard);
    flashCard.collection_id && (await getFlashCards(flashCard.collection_id));
  };

  // const setCustomers = async (customers: Customer) => {
  //     // code here
  // };

  return { getFlashCards, addOneFlashCard, resetFlashCards, updateOneFlashCard };
}

export const useFlashCardStoreValue = () => {
  return useRecoilValue(FlashCardStore);
};
