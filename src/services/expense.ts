import timeUtils from "@/helpers/timeUtils";
import { ExpenseModel, ExpenseTable } from "@/models/expense/expenseModel";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import {
  FlashCardAddRequestModel,
  FlashCardUpdateRequestModel,
} from "@/models/flash-card/flashCardRequestModel";
import { FlashCardGetAllResponseModel } from "@/models/flash-card/flashCardResponseModel";
import superbaseInstance from "@/services/instances/superbaseInstance";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

const EXPENSE_TABLE = ExpenseTable;

const getAll = async (
  collectionId: number
): Promise<PostgrestSingleResponse<ExpenseModel[]>> => {
  const response = await superbaseInstance
    .getInstance()
    .from(ExpenseTable)
    .select("*")
    .order("created_at", { ascending: false });
  return response;
};
const getTotalExpenseByCatagories = async (
  month: number
): Promise<PostgrestSingleResponse<ExpenseModel[]>> => {
  //   const query = `
  //   SELECT et.name AS expense_type, SUM(e.expense_amount) AS total_amount
  //   FROM expenses e
  //   INNER JOIN expense_type et ON e.expense_type = et.id
  //   WHERE EXTRACT(MONTH FROM e.created_at) = 9
  //   GROUP BY et.name;
  // `;

  const res = await superbaseInstance
    .getInstance()
    .from("expenses")
    .select(`expense_name,expense_amount,expense_types(name)`)
    .order("created_at", { ascending: true })
    .order("created_at", {
      ascending: false,
      referencedTable: "expense_types",
    });

  console.log(res);
  return [];
};

interface TotalExpenseFilter {
  from: string;
  to: string;
}

// interface TotalExpenseByCatagories {
async function getTotalExpensesByCatagoriesByTime(filter: TotalExpenseFilter) {
  const firstDayOfMonth = timeUtils.dayjs(filter.from).startOf("month").format("YYYY-MM-DD HH:mm");
  const lastDayOfMonth = timeUtils.dayjs(filter.to).endOf("month").format("YYYY-MM-DD HH:mm");
  console.log(firstDayOfMonth, lastDayOfMonth);
  const { data, error } = await superbaseInstance
    .getInstance()
    .from("expenses")
    .select("expense_types(name), expense_amount.sum()")
    .lt('created_at', lastDayOfMonth)
    .gt('created_at', firstDayOfMonth);
    ;
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log(data);
    return data;
  }
}
const ExpenseService = {
  getAll,
  getTotalExpenseByCatagories,
  getTotalExpensesByCatagoriesByTime,
};
export default ExpenseService;
