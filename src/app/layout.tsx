import RecoilProvider from "@/stores";
import dayjs from "dayjs";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-tooltip/dist/react-tooltip.css'
import Header from "@/components/common/common-header/Header";

dayjs.locale("en");
dayjs.extend(relativeTime);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Header />
        <RecoilProvider>{children}</RecoilProvider>
      </body>
    </html>
  );
}
