import React, { useState } from "react";
import TipTapEditor from "@/components/common/common-tiptap/TiptapEditor";

type CollectionFormProps = {
  onAddCollection: (newCard: { name: string; description: string }) => void;
};



const CollectionForm: React.FC<CollectionFormProps> = ({ onAddCollection }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if both term and description are provided before adding the card
    if (name.trim() === "" || description.trim() === "") {
      alert("Please provide both term and description.");
      return;
    }

    // Call the callback function to add the card
    onAddCollection({ name, description });

    // Clear the form fields after adding the card
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Collection Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Collection Description:
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Collection
      </button>
    </form>
  );
};

export default CollectionForm;
