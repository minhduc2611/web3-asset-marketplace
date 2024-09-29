"use client";
import { generateUniqueFileName } from "@/helpers/fileUtils";
import FlashCardService from "@/services/flashCard";
import { ReactFCC } from "@/types/common";
import { ChangeEvent } from "react";
import { Icons } from "./icons";

const Uploader: ReactFCC<{
  value: string;
  onChange: (url: string) => void;
}> = ({ onChange, value }) => {
  const handleFileChange = async (event: ChangeEvent) => {
    if (event) {
      const target = event.target as EventTarget;
      if (target instanceof HTMLInputElement) {
        if (target.files) {
          const file = target.files[0];
          // fileSize.value = file.size // set file size

          const path = generateUniqueFileName(file);
          console.log("file.name ", path);
          const { data } = await FlashCardService.upload(path, file);
          if (data && data.path) {
            change(data.path);
          }
        }
      }
    }
  };

  const change = (text: string) => {
    onChange(text);
  };
  return (
    <div className="mb-4">
      <label htmlFor="term" className="block text-sm font-medium text-gray-700">
        Upload Image:
      </label>
      {!value && (
        <input
          onChange={handleFileChange}
          type="file"
          accept={'image/*'}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      )}

      {value && (
        <>
          {value}{" "}
          <button type="button" onClick={() => change("")}>
            <Icons.trash />
          </button>
        </>
      )}
    </div>
  );
};

export default Uploader;
