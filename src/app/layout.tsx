import ClientAuthInitiator from "@/components/auth/ClientAuthInitiator";
import Header from "@/components/common/common-header/Header";
import Logo from "@/components/common/common-logo/Logo";
import RecoilProvider from "@/stores";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "react-tooltip/dist/react-tooltip.css";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import React from "react";

dayjs.locale("en");
dayjs.extend(relativeTime);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minh Kim Software",
  description: "Software Development Company",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        {user ? (
          <>
            <ClientAuthInitiator user={user}>
              <Header />
              <div className="h-screen">
                <RecoilProvider>{children}</RecoilProvider>
              </div>
            </ClientAuthInitiator>
          </>
        ) : (
          <div className="h-screen">
            <div
              className={ twMerge("fixed w-full flex items-center justify-center p-5")}
            >
              <Logo />
            </div>
            {children}
          </div>
        )}
      </body>
    </html>
  );
}
