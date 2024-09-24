import { Tables } from "@/supabase/database.types";
import { Builder } from "builder-pattern";
import { randomUUID } from "crypto";

export const ExpenseTable = 'expenses';
export type ExpenseModel = Tables<typeof ExpenseTable>;

export const initExpenseModel = () =>
  Builder<ExpenseModel>()
    .id(randomUUID())
    .expense_amount(0)
    .expense_name("")
    .expense_type_id(null)
    .build();


    // export const TotalExpense
    