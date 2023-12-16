import React, { useRef, useState } from "react";
import TipTapEditor, {
  TipTapEditorHandle,
} from "@/components/common/common-tiptap/TiptapEditor";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { FlashCardUpdateRequestModel } from "@/models/flash-card/flashCardRequestModel";

type CardFormProps = {
  onAddCard: (newCard: { term: string; definition: string }) => void;
  onUpdate: (updateCard: {
    id: number;
    term: string;
    definition: string;
  }) => void;
  scrollToTop: () => void;
};
export type CardFormHandle = {
  setForm: (flash: FlashCardUpdateRequestModel) => void;
};

enum FormStatus {
  Add = "Add",
  Update = "Update",
}
// eslint-disable-next-line react/display-name
const CardForm = React.forwardRef<CardFormHandle | null, CardFormProps>(
  ({ onAddCard, onUpdate, scrollToTop }, ref) => {
    const [term, setTerm] = useState("");
    const [id, setId] = useState(0);
    const [status, setStatus] = useState(FormStatus.Add);
    const editorRef = useRef<TipTapEditorHandle>(null);

    const handleSubmit = (e: React.FormEvent, status: FormStatus) => {
      e.preventDefault();
      const definition = editorRef.current?.getContent().trim() || "";
      // Check if both term and definition are provided before adding the card
      if (term.trim() === "" || definition === "") {
        alert("Please provide both term and definition.");
        return;
      }

      // Call the callback function to add the card

      status === FormStatus.Add
        ? onAddCard({ term, definition })
        : onUpdate({ id, term, definition });

      // Clear the form fields after adding the card
      reset();
    };

    const reset = () => {
      setTerm("");
      setId(0);
      editorRef.current?.setContent("");
      setStatus(FormStatus.Add);
    };

    React.useImperativeHandle(ref, () => ({
      setForm: ({ id, term, definition }: FlashCardUpdateRequestModel) => {
        setTerm(term || "");
        editorRef.current?.setContent(definition || "");
        setStatus(FormStatus.Update);
        setId(id);
        console.log(scrollToTop);
        scrollToTop();
      },
    }));

    return (
      <form onSubmit={(e) => handleSubmit(e, status)} className="mt-4">
        {!!id && <div className="mb-4">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700"
          >
            Card Id :
          </label>
          <input
            type="text"
            id="id"
            value={id}
            disabled
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>}

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
          <TipTapEditor ref={editorRef} />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {status === FormStatus.Add ? "Add Card" : "Update Card"}
        </button>
        <button
          onClick={reset}
          type="reset"
          className="px-4 py-2 text-black rounded-md border ml-2"
        >
          Reset
        </button>
      </form>
    );
  }
);

export default CardForm;
