import FlashCardViewer from "@/classes/FlashCardViewer";
import {
  FlashCardAddRequestModel,
  FlashCardUpdateRequestModel,
} from "@/models/flash-card/flashCardRequestModel";
import { FlashCardStoreModel } from "@/models/flash-card/flashCardStoreModel";
import FlashCardService from "@/services/flashCard";

import { create } from "zustand";

interface Methods {
  setValue: (collectionId: number) => void;
  getValues: (collectionId: number) => void;
  register: (collectionId: number) => void;
}


export const useFormStore = create<{}>((set) => {
  const setValue = async (collectionId: number) => {
    const { data } = await FlashCardService.getAll(collectionId);
    data &&
      set((state) => ({
        ...state,
      }));
  };
  const getValues = async (collectionId: number) => {
    const { data } = await FlashCardService.getAll(collectionId);
    data &&
      set((state) => ({
        ...state,
      }));
  };

  const register = async (stringProperty: number) => {
    return {
      onChange: () => {
        set((state) => ({
          ...state,
        }))
      },
      disabled: false,
    }
  };

  // APIs
  return {
    flashCardViewer: new FlashCardViewer([]),
    setValue,
    getValues,
    register,
  };
});


export const useForm = () => {
  const formStore = useFormStore()


  // todo use resolver with Joi
  return {
    ...formStore
  }
}