import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum Drafting",
  description: "Curriculum Drafting",
};

async function Home() {
  return (
    <main className="min-h-screen p-10 md:px-24 flex items-center justify-center h-full  bg-base-100 text-primary">
      <div>
          Coming soon ...
      </div>
    </main>
  );
}

export default Home;