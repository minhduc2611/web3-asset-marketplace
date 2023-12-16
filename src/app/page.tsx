"use client";

import Link from "next/link";


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Link href="/collections" >Go to Collections</Link>
        </button>
    </main>
  );
}
