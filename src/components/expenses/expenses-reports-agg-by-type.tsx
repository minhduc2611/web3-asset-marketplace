"use client";

import { useExpenseStore } from "@/stores/expenses";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

interface ExpensesReportsAggByTypeProps {}

const ExpensesReportsAggByType = (props: ExpensesReportsAggByTypeProps) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const { totalExpenseByCatagories } = useExpenseStore();
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: Object.keys(totalExpenseByCatagories),
      datasets: [
        {
          data: Object.values(totalExpenseByCatagories),
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
          ],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);
  return (
    <div className="card flex justify-content-center">
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-30rem"
      />
    </div>
  );
};

export default ExpensesReportsAggByType;
