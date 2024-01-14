import TipTapEditor from "@/components/common/common-tiptap/TiptapEditor";
import useFlashCardAdmin from "@/hooks/flash-cards-collection/useFlashCardAdmin";
import { FlashCardUpdateRequestModel } from "@/models/flash-card/flashCardRequestModel";
import React, { FormEvent } from "react";
import Uploader from "../common/Uploader";
import { FormStatus } from "@/enum/common";

type CardFormProps = {
  collectionId: number;
};
export type CardFormHandle = {
  setForm: (flash: FlashCardUpdateRequestModel) => void;
};

// eslint-disable-next-line react/display-name
const CardRegisterForm = React.forwardRef<CardFormHandle | null, CardFormProps>(
  ({ collectionId }, ref) => {
    const {
      flashCardForm,
      formFields,
      addOneFlashCard,
      setValues,
      resetForm: reset,
      updateOneFlashCard,
    } = useFlashCardAdmin();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (flashCardForm.status === FormStatus.Add) {
        addOneFlashCard(collectionId);
      } else {
        updateOneFlashCard(collectionId);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="mt-4">
        {Boolean(flashCardForm.id) && (
          <div className="mb-4">
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              Card Id :
            </label>
            <input
              id={formFields.id.name}
              name={formFields.id.name}
              type="text"
              value={flashCardForm.id}
              disabled
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="term"
            className="block text-sm font-medium text-gray-700"
          >
            Term:
          </label>
          <TipTapEditor
            value={flashCardForm.term}
            onChange={(value) => setValues({ "flashCardForm.term": value })}
          />
        </div>
        <Uploader
          value={flashCardForm.media_url}
          onChange={(url) => setValues({ "flashCardForm.media_url": url })}
        />
        <div className="mb-4">
          <label
            htmlFor="definition"
            className="block text-sm font-medium text-gray-700"
          >
            Definition:
          </label>
          <TipTapEditor
            value={flashCardForm.definition}
            onChange={(value) =>
              setValues({ "flashCardForm.definition": value })
            }
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {flashCardForm.status === FormStatus.Add ? "Add Card" : "Update Card"}
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

export default CardRegisterForm;
