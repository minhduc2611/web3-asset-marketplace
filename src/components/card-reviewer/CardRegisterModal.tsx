"use client";
import { Icons } from "@/components/common/icons";
import { ReactFCC } from "@/types/common";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  useFlashCardStoreActions,
  useFlashCardStoreValue,
} from "@/stores/flashCard";
import { useState } from "react";
import CardForm from "./CardRegisterForm";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import useIsMobile from "@/hooks/useIsMobile";

const CardRegisterModal = ({collectionId}: {collectionId:number}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addOneFlashCard } = useFlashCardStoreActions();
  const { flashCards } = useFlashCardStoreValue();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        className="absolute bottom-32 right-32 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={openModal}
      >
        Add Card
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="w-full h-[90vh] md:h-[500px]">
          <CardForm
            onAddCard={({ term, definition }) => {
              addOneFlashCard({ term, definition, collection_id: collectionId });
            }}
          ></CardForm>
          <Table data={flashCards} />
        </div>
      </Modal>
    </>
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
      <div className="absolute bg-white p-4 rounded-md shadow-md overflow-y-scroll md:min-w-[500px]">
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

const columnHelper = createColumnHelper<FlashCardModel>();

const columns = [
  columnHelper.accessor("term", {
    cell: (info) => info.getValue(),
    header: () => <span>Term</span>,
    size: 25,
  }),
  columnHelper.accessor((row) => row.definition, {
    id: "definition",
    cell: (info) => (
      <div dangerouslySetInnerHTML={{ __html: info.getValue() || "" }}></div>
    ),
    header: () => <span>Definition</span>,
    size: 50,
  }),
  columnHelper.accessor("id", {
    id: "id",
    cell: (info) => (
      <div>
        <button className="p-2 m-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <Icons.pencil />
        </button>
        <button className="p-2 m-1 bg-[#EF4444] text-white rounded-md hover:bg-[#B91C1C]">
          <Icons.trash />
        </button>
      </div>
    ),
    header: () => <span className="w-1/4">Action</span>,
    size: 25,
  }),
];

function Table({ data }: { data: FlashCardModel[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const isMobile = useIsMobile();
  return (
    data.length > 0 && (
      <div className="p-2">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: `${isMobile ? 30 : header.getSize()}%` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="border m-2 p-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default CardRegisterModal;
