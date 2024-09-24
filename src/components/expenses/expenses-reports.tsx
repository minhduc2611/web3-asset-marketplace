"use client";

import { Chart } from "primereact/chart";
import ExpensesReportsAggByType from "./expenses-reports-agg-by-type";
import ExpensesReportsTotal from "./expenses-reports-total";

interface ExpensesReportsProps {}

const ExpensesReports = (props: ExpensesReportsProps) => {

  return (
    <div className="">
      <ExpensesReportsTotal />
      <ExpensesReportsAggByType />
    </div>
  );
};

export default ExpensesReports;
