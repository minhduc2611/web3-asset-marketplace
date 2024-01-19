"use client";

import CollectionRegisterModal from "@/components/collection/CollectionRegisterModal";
import timeUtils from "@/helpers/timeUtils";
import {
  useCollectionStoreActions,
  useCollectionStoreValue,
} from "@/stores/collection";
import Link from "next/link";
import { useEffect } from "react";
export default function Home() {
  const { getCollections } = useCollectionStoreActions();
  const { collections } = useCollectionStoreValue();

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <main className="min-h-screen p-10 md:p-24">
    <CollectionRegisterModal />
      <div className="grid md:grid-cols-4 md:gap-4 gap-4">
        {collections.map((collection) => {
          return (
            <div
              key={collection.id}
              className="block rounded-lg bg-white text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
            >
              <div className="border-b-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
                Featured
              </div>
              <div className="p-6">
                <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                  {`"${collection.name}"`} Pack
                </h5>
                <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
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

