"use client";
import { Icons } from "@/components/common/icons";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import useFlashCardAdmin from "@/hooks/flash-cards-collection/useFlashCardAdmin";
import useIsMobile from "@/hooks/useIsMobile";
import useScrollTo from "@/hooks/useScrollTo";
import { cn } from "@/lib/utils";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { useMemo, useRef, useState } from "react";
import CardForm, { CardFormHandle } from "./CardRegisterForm";

const CardRegisterModal = ({ collectionId }: { collectionId: number }) => {
  const { isAdminOpen, flashCards, setAdminModal, editCard, resetForm } =
    useFlashCardAdmin();
  const formRef = useRef<CardFormHandle>(null);
  const { divRef, scrollTo } = useScrollTo();

  return (
    <>
      <button
        className={cn(
          "md:absolute mx-auto mb-10 bottom-12 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        )}
        onClick={() => setAdminModal(true)}
      >
        Add Card
      </button>
      <button
        className={cn(
          "md:absolute mx-auto mb-10 ml-5 left-40 bottom-12 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        )}
        onClick={() => editCard()}
      >
        Edit Card
      </button>
      <div
        className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 transition-opacity ${
          isAdminOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          ref={divRef}
          className="absolute bg-white p-14 rounded-md shadow-md overflow-y-scroll md:w-[100vw] md:h-[100vh]"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">FlashCards</h2>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => {
                setAdminModal(false);
                resetForm();
              }}
            >
              <Icons.close />
            </button>
          </div>
          <div className="mt-4">
            <div className="w-full h-[90vh] md:h-[500px]">
              <CardForm ref={formRef} collectionId={collectionId} />
              <Table
                data={flashCards}
                edit={(data) => {
                  formRef.current?.setForm(data);
                  editCard(data);
                  scrollTo();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const columnHelper = createColumnHelper<FlashCardModel>();

function Table({
  data,
  edit,
}: {
  data: FlashCardModel[];
  edit: (data: FlashCardModel) => void;
}) {
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.term, {
        id: "term",
        cell: (info) => (
          <div
            dangerouslySetInnerHTML={{ __html: info.getValue() || "" }}
          ></div>
        ),
        header: () => <span>Definition</span>,
        size: 40,
      }),
      columnHelper.accessor((row) => row.definition, {
        id: "definition",
        cell: (info) => (
          <div
            dangerouslySetInnerHTML={{ __html: info.getValue() || "" }}
          ></div>
        ),
        header: () => <span>Definition</span>,
        size: 40,
      }),
      columnHelper.accessor((row) => row, {
        id: "id",
        cell: (info: CellContext<FlashCardModel, FlashCardModel>) => (
          <div>
            <button
              className="p-2 m-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => edit(info.getValue())}
            >
              <Icons.pencil />
            </button>
            <button className="p-2 m-1 bg-[#EF4444] text-white rounded-md hover:bg-[#B91C1C]">
              <Icons.trash />
            </button>
          </div>
        ),
        header: () => <span className="w-1/4">Action</span>,
        size: 20,
      }),
    ],
    []
  );
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
