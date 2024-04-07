"use client";
import { useClientAuthStore } from "@/stores/authentication";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import AppDrawer from "@/components/common/common-drawer/AppDrawer";
import Logo from "@/components/common/common-logo/Logo";
import useIsMobile from "@/hooks/useIsMobile";

const Header = () => {
  const path = usePathname();
  const { isLoading, user } = useClientAuthStore();
  const isMobile = useIsMobile();

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
        <Logo className={twMerge(isMobile ? "w-12" : 'w-52')} />
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
