"use client";

import Expenses from "@/components/expenses/main";

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.min.css';

import 'primereact/resources/themes/lara-light-cyan/theme.css';

export default function Home() {
  return <main className="h-[100vh] min-w-screen pt-20">
    <Expenses />
  </main>;
}
