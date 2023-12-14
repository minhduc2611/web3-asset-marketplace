import React, { useState } from "react";
import TipTapEditor from "../Common/Tiptap";

type CardFormProps = {
  onAddCard: (newCard: { term: string; definition: string }) => void;
};

const CardForm: React.FC<CardFormProps> = ({ onAddCard }) => {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if both term and definition are provided before adding the card
    if (term.trim() === "" || definition.trim() === "") {
      alert("Please provide both term and definition.");
      return;
    }

    // Call the callback function to add the card
    onAddCard({ term, definition });

    // Clear the form fields after adding the card
    setTerm("");
    setDefinition("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label
          htmlFor="term"
          className="block text-sm font-medium text-gray-700"
        >
          Term:
        </label>
        <input
          type="text"
          id="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="definition"
          className="block text-sm font-medium text-gray-700"
        >
          Definition:
        </label>
        {/* <textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          rows={4}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        /> */}
        <TipTapEditor
        value={definition}
        onChange={(value) => setDefinition(value)}
         />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Card
      </button>
    </form>
  );
};

export default CardForm;
