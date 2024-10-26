"use client";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";

import CollectionRegisterModal from "@/components/collection/CollectionRegisterModal";
import timeUtils from "@/helpers/timeUtils";
import {
  useCollectionStoreActions,
  useCollectionStoreValue,
} from "@/stores/collection";
import Link from "next/link";

import { useClientAuthStore } from "@/stores/authentication";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";

import "primeicons/primeicons.css";
// import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function Home() {
  const { getCollections } = useCollectionStoreActions();
  const { collections } = useCollectionStoreValue();
  const { user } = useClientAuthStore();
  if (!user) {
    redirect("/login");
  }
  useEffect(() => {
    getCollections();
  }, []);
  const menuLeft = useRef<Menu>(null);
  const toast = useRef(null);

  return (
    <main className="min-h-screen p-10 md:px-24 bg-base-100 overflow-y-scroll">
      <CollectionRegisterModal />
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-6 gap-4 w-full">
        {collections.map((collection) => {
          return (
            <div
              key={collection.id}
              className="block rounded-lg bg-white text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
            >
              <div className="relative flex items-center justify-center border-b-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
                <div className="">Featured</div>
                <div className="absolute bottom-0 right-0">
                  {(() => {
                    const items = [
                      {
                        label: "Options",
                        items: [
                          {
                            label: "Share",
                            icon: "pi pi-share-alt",
                            command: () => {
                              console.log("Share", collection.id);
                            },
                          },
                        ],
                      },
                    ];
                    return (
                      <>
                        <Toast ref={toast}></Toast>
                        <Menu
                          model={items}
                          popup
                          ref={menuLeft}
                          id="popup_menu_left"
                        />
                        <Button
                          rounded
                          text
                          icon="pi pi-list"
                          onClick={(event) => menuLeft?.current && menuLeft.current.toggle && menuLeft.current.toggle(event)}
                          aria-controls="popup_menu_left"
                          aria-haspopup
                        />
                      </>
                    );
                  })()}
                </div>
              </div>
              <div className="p-6">
                <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                  {`"${collection.name}"`} Pack
                </h5>
                <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                  {collection.description}
                </p>
                <Link
                  href={"collections/" + collection.id}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Learn
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </Link>
              </div>
              <div className="border-t-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
                {timeUtils.dayjs(collection.created_at).fromNow()}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
