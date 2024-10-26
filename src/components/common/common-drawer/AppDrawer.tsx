"use client";
import { useClientAuthStore } from "@/stores/authentication";
import { useMemo } from "react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Link from "next/link";
import { Icons } from "../icons";
import ThemeSelector from "@/components/common/common-theme-selector/ThemeSelector";

interface AppDrawerProps {}

const AppDrawer = (props: AppDrawerProps) => {
  const { isLoading, user, logout } = useClientAuthStore();
  const router = useRouter();
  const userAvatar = useMemo<string>(() => {
    if (user) {
      const availablePhotos = user?.identities
        ?.map((identity) => identity?.identity_data?.avatar_url || null)
        .filter((ava) => ava !== null);
      if (availablePhotos && availablePhotos.length > 0) {
        return availablePhotos[0];
      }
    }
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }, [user]);
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const close = () => {
    setIsOpen(false);
  };
  const handleLogout = async () => {
    await logout();
    close();
    router.push("/login");
    router.refresh();
  };

  return (
    <div>
      <Image
        onClick={toggleDrawer}
        width={40}
        height={40}
        className="rounded-full cursor-pointer"
        src={userAvatar}
        alt="Rounded avatar"
      />

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        className=""
      >
        <div className="p-5 h-full bg-base-100">
          <div className="w-full flex items-center justify-center">
            <label className="swap swap-flip text-4xl">
              <input type="checkbox" />
              <div className="swap-on">
                {Math.round(Math.random()) ? "😇" : "😈"}
              </div>
              <div className="swap-off">
                <Image
                  width={40}
                  height={40}
                  className="rounded-full"
                  src={userAvatar}
                  alt="Rounded avatar"
                />
              </div>
            </label>
          </div>
          <div className="divider"></div>

          <ThemeSelector />
          <Link
            onClick={close}
            href="/learn"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.book className="mr-4" />
            Learn
          </Link>
          <Link
            onClick={close}
            href="/brain-log"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.remember className="mr-4" />
            Brain Log
          </Link>
          <Link
            onClick={close}
            href="/collections"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.collections className="mr-4" />
            Flash cards
          </Link>
          <Link
            onClick={close}
            href="/expenses"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.billing className="mr-4" />
            Expenses & Finance
          </Link>
          <Link
            onClick={close}
            href="/projects"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.capperboard className="mr-4" />
            Curriculum Crafting
          </Link>
          <Link
            onClick={close}
            href="/projects"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.blocks className="mr-4" />
            Projects
          </Link>
          <Link
            onClick={close}
            href="/car"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.car className="mr-4" />
            Drive
          </Link>
          <div className="divider"></div>
          <Link
            onClick={close}
            href="/settings"
            className="w-full flex mt-3 text-left font-medium text-gray-500 hover:text-gray-800"
          >
            <Icons.settings className="mr-4" />
            Setting
          </Link>
          <div className="divider"></div>
          <button type="button" onClick={handleLogout} className="btn w-full">
            Logout
          </button>
        </div>
      </Drawer>
    </div>
  );
};

export default AppDrawer;
