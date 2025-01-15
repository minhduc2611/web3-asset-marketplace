"use client";
import AppDrawer from "@/components/common/common-drawer/AppDrawer";
import Logo from "@/components/common/common-logo/Logo";
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useClientAuthStore } from "@/stores/authentication";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/components/common/icons";

const Header = () => {
  const path = usePathname();
  const router = useRouter();
  const { isLoading, user } = useClientAuthStore();

  const isMobile = useIsMobile();
  const pathNoIconLogo = ["/tinder", "/components"];
  if (isLoading) {
    return <></>;
  }
  const showBackButton = isMobile && path !== "/";
  return !pathNoIconLogo.includes(path) ? (
    <header className="bg-base-100 flex justify-between p-2  items-center">
      <div
        className={cn(
          path === "/" ? "top-10 left-10" : "",
          "flex",
          " flex justify-between items-center"
        )}
      >
        ????
        {showBackButton ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              // going back, ex: /collections/1 -> /collections; /collections -> /; / -> /; /tinder -> /; /products/1 -> /products
              const pathArr = path.split("/");
              pathArr.pop();
              const newPath = pathArr.join("/");
              const final = newPath === "" ? "/" : newPath;
              router.push(final);
            }}
          >
            <Icons.chevronLeft />
          </button>
        ) : (
          <Logo />
        )}
      </div>
      {showBackButton && <Logo />}
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
      ????
      {user && <AppDrawer />}
    </header>
  ) : (
    <></>
  );
};

export default Header;
