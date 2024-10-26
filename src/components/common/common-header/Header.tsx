"use client";
import { useClientAuthStore } from "@/stores/authentication";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppDrawer from "@/components/common/common-drawer/AppDrawer";
import Logo from "@/components/common/common-logo/Logo";
import { cn } from "@/lib/utils";

const Header = () => {
  const path = usePathname();
  const { isLoading, user } = useClientAuthStore();

  const pathNoIconLogo = ["/tinder", "/components"];

  if (isLoading) {
    return <></>;
  }

  return !pathNoIconLogo.includes(path) ? (
    <header className="bg-base-100 flex justify-between p-2  items-center">
      <div
        className={cn(
          path === "/" ? "top-10 left-10" : "top-1 left-1",
          "flex"
        )}
      >
        <Logo />
      </div>

      <div
        className={cn(
          path === "/" ? "top-10 right-10" : "top-1 right-3",
          "flex"
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
      </div>
        {user && <AppDrawer />}
    </header>
  ) : (
    <></>
  );
};

export default Header;
