import CanvasList from "@/components/pages/canvas-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canvas",
  description: "Canvas",
};

export default async function CanvasPage() {
  return <CanvasList />;
}
