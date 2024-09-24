"use client";
import { useClientAuthStore } from "@/stores/authentication";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import Drawer from "react-modern-drawer";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
interface ExpensesTableProps {}

const ExpensesTable = (props: ExpensesTableProps) => {
  const { isLoading, user, logout } = useClientAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [tabIndex, setTabIndex] = React.useState(0);
  return (
    <DataTable value={[]} tableStyle={{ minWidth: "50rem" }}>
      <Column field="code" header="Code"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="quantity" header="Quantity"></Column>
    </DataTable>
  );
};

export default ExpensesTable;
