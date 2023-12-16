"use client";

import {
  useCollectionStoreActions,
  useCollectionStoreValue,
} from "@/stores/collection";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import CollectionRegisterModal from "@/components/collection/CollectionRegisterModal";
export default function Home() {
  const { getCollections } = useCollectionStoreActions();
  const { collections } = useCollectionStoreValue();
  useEffect(() => {
    getCollections();
  }, []);
  return (
    <main className="min-h-screen p-24">
      <div className="grid grid-cols-4 gap-4">
        {collections.map((collection) => {
          return (
            <div
              key={collection.id}
              className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 "
            >
              <span>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {`"${collection.name}"`} Pack
                </h5>
              </span>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 h-[60px]">
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
          );
        })}
      </div>

      <CollectionRegisterModal />
    </main>
  );
}

//

{
  /*  */
}
