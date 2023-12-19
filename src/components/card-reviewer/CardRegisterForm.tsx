import React, { useRef, useState } from "react";
import TipTapEditor, {
  TipTapEditorHandle,
} from "@/components/common/common-tiptap/TiptapEditor";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { FlashCardUpdateRequestModel } from "@/models/flash-card/flashCardRequestModel";
import { useForm, SubmitHandler } from "react-hook-form";
import Uploader from "../common/Uploader";

type CardFormProps = {
  onAddCard: (newCard: {
    term: string;
    definition: string;
    media_url: string;
  }) => void;
  onUpdate: (updateCard: {
    id: number;
    term: string;
    definition: string;
    media_url: string;
  }) => void;
  scrollToTop: () => void;
};
export type CardFormHandle = {
  setForm: (flash: FlashCardUpdateRequestModel) => void;
};
type Inputs = {
  id: number;
  term: string;
  definition: string;
  media_url: string;

  status: FormStatus;
};
enum FormStatus {
  Add = "Add",
  Update = "Update",
}
// eslint-disable-next-line react/display-name
const CardForm = React.forwardRef<CardFormHandle | null, CardFormProps>(
  ({ onAddCard, onUpdate, scrollToTop }, ref) => {
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm<Inputs>({
      mode: "onChange",
      defaultValues: {
        id: 0,
        term: "",
        definition: "",
        media_url: "",
        status: FormStatus.Add,
      },
    });

    const editorRef = useRef<TipTapEditorHandle>(null);

    const handleSubmitCallBack: SubmitHandler<Inputs> = (input: Inputs) => {
      console.log("input @@", input);

      const definition = editorRef.current?.getContent().trim() || "";

      // Check if both term and definition are provided before adding the card
      if (
        input.term.trim() === "" ||
        definition === "" ||
        input.media_url === ""
      ) {
        alert("Please provide both term and definition.");
        return;
      }

      // Call the callback function to add the card
      input.status === FormStatus.Add ? onAddCard(input) : onUpdate(input);
      console.log("input", input);
      // Clear the form fields after adding the card
      reset();
    };

    const reset = () => {
      setValue("term", "");
      setValue("id", 0);
      setValue("status", FormStatus.Add);
      setValue("media_url", "");
      editorRef.current?.setContent("");
    };

    React.useImperativeHandle(ref, () => ({
      setForm: ({
        id,
        term,
        definition,
        media_url,
      }: FlashCardUpdateRequestModel) => {
        setValue("id", id);
        setValue("term", term || "");
        setValue("definition", definition || "");
        editorRef.current?.setContent(definition || "");
        setValue("media_url", media_url || "");
        setValue("status", FormStatus.Update);
        scrollToTop();
      },
    }));

    return (
      <form onSubmit={handleSubmit(handleSubmitCallBack)} className="mt-4">
        {Boolean(watch("id")) && (
          <div className="mb-4">
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              Card Id :
            </label>
            <input
              {...register("id")}
              type="text"
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
          <input
            {...register("term")}
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <Uploader
          value={watch("media_url")}
          onChange={(url) => {
            setValue("media_url", url);
          }}
        />
        <div className="mb-4">
          <label
            htmlFor="definition"
            className="block text-sm font-medium text-gray-700"
          >
            Definition:
          </label>
          <TipTapEditor
            onChange={(st) => {
              setValue("definition", st);
            }}
            ref={editorRef}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {watch("status") === FormStatus.Add ? "Add Card" : "Update Card"}
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
