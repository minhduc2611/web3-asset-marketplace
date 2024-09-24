"use client";

import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

interface ExpensesReportsTotalProps {}

const ExpensesReportsTotal = (props: ExpensesReportsTotalProps) => {
  
  return (
    <div className="card flex flex-row justify-between pb-5">
      <div className="flex flex-col w-[30%] text-center">
        <span>Day</span>
        <span>€100</span>
      </div>
    
      <div className="flex flex-col w-[30%] text-center">
        <span>Week</span>
        <span>€100</span>
      </div>
      <div className="flex flex-col w-[30%] text-center">
        <span>Month</span>
        <span>€100</span>
      </div>
    </div>
  );
};

export default ExpensesReportsTotal;
