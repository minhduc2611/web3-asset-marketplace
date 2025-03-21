"use client";
import { Icons } from "@/components/common/icons";
import { ReactFCC } from "@/types/common";

import { useCollectionStoreActions } from "@/stores/collection";
import { useState } from "react";
import CollectionForm from "./CollectionForm";
import { Tooltip } from "react-tooltip";
import { useClientAuthStore } from "@/stores/authentication";

const CollectionRegisterModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addOneCollection } = useCollectionStoreActions();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { user } = useClientAuthStore();

  if (!user) {
    return <>Authenticated user is not found</>;
  }

  return (
    <>
      <button
        className="md:fixed md:top-15 md:right-10 md:w-[40px] z-50 w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={openModal}
        data-tooltip-id="add-a-collection"
        data-tooltip-content="Add a collection"
      >
        +
      </button>
      <Tooltip id="add-a-collection" place={"left"} className="z-50"/>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="w-full h-full md:h-[500px]">
          <CollectionForm
            onAddCollection={({ name, description }) => {
              addOneCollection({ name, description, author_id: user.id});
              closeModal();
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
      <div className="absolute bg-base-200 p-4 rounded-md shadow-md overflow-y-scroll w-full h-full md:w-[600px] md:h-[80vh] ">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add A Collection</h2>
          <button
            className="px-2 py-1 bg-blue-500 text-primary rounded-md hover:bg-blue-600"
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
