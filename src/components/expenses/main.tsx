"use client";
import { useClientAuthStore } from "@/stores/authentication";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect } from "react";
import Drawer from "react-modern-drawer";
import { Icons } from "../common/icons";
import ExpensesTable from "./expenses-table";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { useExpenseStore } from "@/stores/expenses";
import ExpensesReports from "./expenses-reports";

interface ExpensesProps {}

const Expenses = (props: ExpensesProps) => {
  const { isLoading, user, logout } = useClientAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [tabIndex, setTabIndex] = React.useState(0);
  const tabs = [
    {
      title: "Expenses",
      icon: <Icons.user />,
    },
    {
      title: "Charts",
      icon: <Icons.book />,
    },
  ];

  const { getTotalExpenseByCatagories } = useExpenseStore();

  useEffect(() => {
    getTotalExpenseByCatagories();
  }, []);

  return (
    <>
      <div className="absolute bottom-0 w-full flex justify-center p-3 z-50">
        <button className="btn" onClick={toggleDrawer}>
          <Icons.add />
          Add
        </button>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction="bottom"
          size={500}
        >
          <div className="p-5 h-[500px]">Add</div>
        </Drawer>
      </div>
      <div className="w-full">
        <TabView>
          <TabPanel header="Report">
            <ExpensesReports />
          </TabPanel>
          <TabPanel header="Records">
            <ExpensesTable />
          </TabPanel>
          <TabPanel header="Filters">
            <p className="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga. Et harum quidem rerum
              facilis est et expedita distinctio. Nam libero tempore, cum soluta
              nobis est eligendi optio cumque nihil impedit quo minus.
            </p>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default Expenses;
