import BrainLogMainPage from "@/components/brain-log/BrainLogMainPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brain Log",
  description: "Your second brain",
};

export default function Home() {
  return <BrainLogMainPage />;
}
