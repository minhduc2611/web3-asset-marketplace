import { ExpenseStoreModel } from "@/models/expense/expenseStoreModel";
import {
  FlashCardAddRequestModel,
  FlashCardUpdateRequestModel,
} from "@/models/flash-card/flashCardRequestModel";
import { FlashCardStoreModel } from "@/models/flash-card/flashCardStoreModel";
import ExpenseService from "@/services/expense";
import FlashCardService from "@/services/flashCard";

import { create } from "zustand";

interface Methods {
  getExpense: (collectionId: number) => void;
  getTotalExpenseByCatagories: () => void;
  totalExpenseByCatagories: Record<string, string>;
  //   resetFlashCards: () => void;
}
const defaultData = () => [];
const defaultExpensesByCategories = () => {
  return {} as Record<string, string>;
};

export const useExpenseStore = create<ExpenseStoreModel & any>((set: any) => {
  const getExpense = async (collectionId: number) => {
    const { data } = await FlashCardService.getAll(collectionId);
    data &&
      set((state: any) => ({
        ...state,
        // flashCardViewer: new FlashCardViewer(data),
      }));
  };

  const getTotalExpenseByCatagories = async () => {
    // const data = await ExpenseService.getTotalExpensesByTime({
    //   from: "09-01-2024",
    //   to: "09-30-2024",
    // }); // format is MM-DD-YYYY
    // set((state) => ({
    //   ...state,
    //   totalExpenseByCatagories: data as Record<string, string>,
    // }));
    return [];
  };

  // const resetFlashCards = () => {
  //   set((state) => ({
  //     ...state,
  //     expenses: defaultData(),
  //   }));
  // };

  return {
    expenses: defaultData(),
    expensesByCategories: defaultExpensesByCategories(),
    totalExpenseByCatagories: defaultData(),
    getExpense,
    getTotalExpenseByCatagories,
  };
});
