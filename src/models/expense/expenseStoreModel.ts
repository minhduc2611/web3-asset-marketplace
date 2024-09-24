import FlashCardViewer from "@/classes/FlashCardViewer";
import { ExpenseModel } from "./expenseModel";


export class FromA {
    getValues(){}
    validateValues(){}
}

export interface ExpenseStoreModel {
    expenses: ExpenseModel[]
    form?: FromA
}