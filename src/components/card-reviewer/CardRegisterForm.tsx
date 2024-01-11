import React, { useRef, useState } from "react";
import TipTapEditor, {
  TipTapEditorHandle,
} from "@/components/common/common-tiptap/TiptapEditor";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { FlashCardUpdateRequestModel } from "@/models/flash-card/flashCardRequestModel";
import { useForm, SubmitHandler } from "react-hook-form";
import Uploader from "../common/Uploader";
import useFlashCardAdmin from "@/hooks/flash-cards-collection/useFlashCardAdmin";

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
  ({  }, ref) => {
    const {
      form: { values, submit, setValues },
      formFields,
    } = useFlashCardAdmin();

    // const {
    //   register,
    //   handleSubmit,
    //   watch,
    //   setValue,
    //   formState: { errors },
    // } = useForm<Inputs>({
    //   mode: "onChange",
    //   defaultValues: {
    //     id: 0,
    //     term: "",
    //     definition: "",
    //     media_url: "",
    //     status: FormStatus.Add,
    //   },
    // });

    const editorRefTerm = useRef<TipTapEditorHandle>(null);
    const editorRefDefinition = useRef<TipTapEditorHandle>(null);

    // const handleSubmitCallBack: SubmitHandler<Inputs> = (input: Inputs) => {
    //   const term = editorRefTerm.current?.getContent().trim() || "";
    //   const definition = editorRefDefinition.current?.getContent().trim() || "";

    //   // Check if both term and definition are provided before adding the card
    //   if (term.trim() === "" || definition === "") {
    //     alert("Please provide both term and definition.");
    //     return;
    //   }

    //   // Call the callback function to add the card
    //   input.status === FormStatus.Add ? onAddCard(input) : onUpdate(input);
    //   console.log("input", input);
    //   // Clear the form fields after adding the card
    //   reset();
    // };

    const reset = () => {
      // setValue("id", 0);
      // setValue("status", FormStatus.Add);
      // setValue("media_url", "");
      // editorRefTerm.current?.setContent("");
      // editorRefDefinition.current?.setContent("");
    };

    // React.useImperativeHandle(ref, () => ({
    //   setForm: ({
    //     id,
    //     term,
    //     definition,
    //     media_url,
    //   }: FlashCardUpdateRequestModel) => {
    //     setValue("id", id);
    //     setValue("term", term || "");
    //     editorRefTerm.current?.setContent(term || "");
    //     setValue("definition", definition || "");
    //     editorRefDefinition.current?.setContent(definition || "");
    //     setValue("media_url", media_url || "");
    //     setValue("status", FormStatus.Update);
    //     scrollToTop();
    //   },
    // }));

    return (
      <form onSubmit={() => {}} className="mt-4">
        {Boolean(values[formFields.id.name]) && (
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
              value={values[formFields.id.name]}
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
            value={values[formFields.term.name]}
            onChange={(st) => {
              console.log('hu')
              setValues({
                term: st,
              });
            }}
          />
        </div>
        <Uploader
          value={values[formFields.media_url.name]}
          onChange={(url) => setValues({ media_url: url })}
        />
        <div className="mb-4">
          <label
            htmlFor="definition"
            className="block text-sm font-medium text-gray-700"
          >
            Definition:
          </label>
          <TipTapEditor
            value={values[formFields.definition.name]}
            onChange={(st) => setValues({ definition: st })}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {values[formFields.status.name] === FormStatus.Add ? "Add Card" : "Update Card"}
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
