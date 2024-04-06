"use client";
import { useClientAuthStore } from "@/stores/authentication";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Icons } from "../icons";
import AppDrawer from "../common-drawer/AppDrawer";

const Header = () => {
  const path = usePathname();
  const { isLoading, user } = useClientAuthStore();

  if (isLoading) {
    return <></>;
  }

  return (
    <header className="fixed z-50">
      <div
        className={twMerge(
          path === "/" ? "top-10 left-10" : "top-1 left-1",
          "fixed flex"
        )}
      >
        <Link href="/" className="flex items-center">
          <Icons.logoMinhKim className={path === "/" ? "w-52" : "w-20"} />
        </Link>
      </div>

      <div
        className={twMerge(
          path === "/" ? "top-10 right-10" : "top-1 right-3",
          "fixed flex"
        )}
      >
        {!user && (
          <Link
            href="/login"
            className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          >
            Log in
          </Link>
        )}
        {user && <AppDrawer />}
      </div>
    </header>
  );
};

export default Header;
