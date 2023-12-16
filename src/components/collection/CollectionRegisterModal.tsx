"use client";
import { Icons } from "@/components/common/icons";
import { ReactFCC } from "@/types/common";

import {
  useFlashCardStoreActions,
  useFlashCardStoreValue,
} from "@/stores/flashCard";
import { useState } from "react";
import CollectionForm from "./CollectionForm";
import { useCollectionStoreActions } from "@/stores/collection";

const CollectionRegisterModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addOneCollection } = useCollectionStoreActions();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        className="absolute bottom-32 right-32 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={openModal}
      >
        Add Collection
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="w-full h-[90vh] md:h-[500px]">
          <CollectionForm
            onAddCollection={({ name, description }) => {
              addOneCollection({ name, description });
              closeModal()
            }}
          />
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
      <div className="md:w-[600px] absolute bg-white p-4 rounded-md shadow-md overflow-y-scroll min-w-[500px]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add A Collection</h2>
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

export default CollectionRegisterModal;
