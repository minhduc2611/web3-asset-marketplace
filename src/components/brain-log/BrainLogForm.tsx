import TipTapEditor from "@/components/common/common-tiptap/TiptapEditor";
import { Icons } from "@/components/common/icons";
import React, { useState } from "react";
import { isMobile, isTablet } from "react-device-detect";

type BrainLogFormProps = {
  onSubmit: (content: string) => void;
  className?: string;
  editable?: boolean;
};

export type BrainLogFormHandle = {
  setForm: (content: string) => void;
};

// eslint-disable-next-line react/display-name
const BrainLogForm = React.forwardRef<
  BrainLogFormHandle | null,
  BrainLogFormProps
>(({ editable, className, onSubmit }, ref) => {
  const [content, setContent] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === "") {
      alert("Please provide content.");
      return;
    }

    // Call the callback function to add the card
    onSubmit(content);

    // Clear the form fields after adding the card
    setContent("");
  };

  React.useImperativeHandle(ref, () => ({
    setForm: (content: string) => {
      setContent(content);
    },
  }));

  return isMobile || isTablet ? (
    <div>
      <Icons.add className="cursor-pointer" />
    </div>
  ) : (
    <form onSubmit={handleSubmit} className={className + " mt-4"}>
      <div className="mb-4">
        <TipTapEditor value={content} onChange={(value) => setContent(value)} />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
});

export default BrainLogForm;
