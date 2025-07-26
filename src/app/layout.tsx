import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { initializeNeo4j } from "./api/services/neo4j";
import "./globals.css";

import AuthCheck from "@/components/auth-check";
import { Toaster } from "@/components/ui/sonner";
import User from "@/components/user";
import FeedbackWidget from "@/components/feedback-widget";
import GlobalTextHighlighter from "@/components/global-text-highlighter";
initializeNeo4j();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindGraph",
  description: "MindGraph is a platform for creating and sharing mind maps.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-scroll`}
      >
        <AuthCheck>
          <Toaster richColors />
          <User />
          <FeedbackWidget />
          {children}
          <GlobalTextHighlighter />
        </AuthCheck>
      </body>
    </html>
  );
}
