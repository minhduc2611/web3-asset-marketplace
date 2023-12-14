"use client";
import { Icons } from "@/components/icons";
import { Database } from "@/supabase/database.types";
import { ReactFCC } from "@/types/common";
import { createClient } from "@supabase/supabase-js";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
const supabaseUrl = "https://skvnrwmwmcvsevknedhm.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey || "");
type Card = {
  collection_id: number | null;
  created_at: string;
  definition: string | null;
  deleted_at: string | null;
  id: number;
  term: string | null;
};
const getAll = async () => await supabase.from("cards").select("*");
const insertOne = async ({ term, definition, collection_id }: Card) =>
  await supabase
    .from("cards")
    .insert([{ term, definition, collection_id: collection_id }])
    .select();

export default function Home() {
  const [data, setData] = useState<Card[]>(() => []);
  const [error, setError] = useState<any>();
  const getCards = async () => {
    let { data: cards, error: e } = await getAll();
    if (cards) {
      setData(cards);
    }
    setError(e);
  };
  // { term: "someValue", definition: "otherValue", collection_id: 2 }
  const insertCards = async (card: Card) => {
    const { data: cards, error } = await insertOne(card);
    if (cards) {
      setData(cards);
    }
  };
  useEffect(() => {
    getCards();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-3xl font-semibold text-center my-8">Flashcards</h1>
        <FlashcardContainer cards={data} />
      </div>
      {data.length > 0 && <ModalButton cards={data} />}
    </main>
  );
}

const ModalButton = ({ cards }: { cards: Card[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="absolute bottom-32 right-32 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={openModal}
      >
        Add Card
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="w-full h-[500px]">
          <Table data={cards} />
        </div>
      </Modal>
    </>
  );
};
const Card = ({ card, onNext }: { card: Card; onNext: () => void }) => {
  const [showDefinition, setShowDefinition] = useState(false);
  const [shouldNext, setShouldNext] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md m-4 w-[500px]">
      <div
        className={`text-center p-4 transition-all transform ${
          showDefinition ? "rotate-y-180" : ""
        }`}
      >
        <h2 className="text-xl font-semibold">{card.term}</h2>
        <p className="mt-2 text-gray-600 min-h-[200px]">
          {showDefinition && card.definition}
        </p>
      </div>
      <div className="flex justify-end p-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => {
            setShowDefinition(!showDefinition);
            setShouldNext(true);
          }}
        >
          {showDefinition ? "Hide Definition" : "Show Definition"}
        </button>
        <button
          disabled={!shouldNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-3 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          onClick={() => {
            setShowDefinition(false);
            onNext();
            setShouldNext(false);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const FlashcardContainer = ({ cards }: { cards: Card[] }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  return (
    <div className="flex flex-wrap justify-center">
      {cards.length > 0 && (
        <Card card={cards[currentCardIndex]} onNext={handleNext} />
      )}
    </div>
  );
};

const Modal: ReactFCC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute bg-white p-4 rounded-md shadow-md w-[900px]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">FlashCards</h2>
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={onClose}
          >
            <Icons.close />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

const columnHelper = createColumnHelper<Card>();

const columns = [
  columnHelper.accessor("term", {
    cell: (info) => info.getValue(),
    header: () => <span>Term</span>,
  }),
  columnHelper.accessor((row) => row.definition, {
    id: "definition",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Definition</span>,
  }),
];

function Table({ data }: { data: Card[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} width={"50%"}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
