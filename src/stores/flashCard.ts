import FlashCardViewer from "@/classes/FlashCardViewer";
import { FlashCardAddRequestModel, FlashCardUpdateRequestModel } from "@/models/flash-card/flashCardRequestModel";
import { FlashCardStoreModel } from "@/models/flash-card/flashCardStoreModel";
import FlashCardService from "@/services/flashCard";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export const FlashCardStore = atom<FlashCardStoreModel>({
  key: "flash-card",
  default: {
    flashCardViewer: new FlashCardViewer([]),
  },
});

// Store actions should be here in store file
export function useFlashCardStoreActions() {
  const setFlashCardStore = useSetRecoilState(FlashCardStore);
  const resetFlashCards = () => {
    setFlashCardStore({ flashCardViewer: new FlashCardViewer([]) });
  };
  const getFlashCards = async (collectionId: number) => {
    const { data } = await FlashCardService.getAll(collectionId);
    data && setFlashCardStore({ flashCardViewer: new FlashCardViewer(data) });
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
