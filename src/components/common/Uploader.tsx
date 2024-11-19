"use client";
import { generateUniqueFileName } from "@/helpers/fileUtils";
import FlashCardService, { FLASK_CARD_BUCKET } from "@/services/flashCard";
import { ReactFCC } from "@/types/common";
import { ChangeEvent } from "react";
import { Icons } from "./icons";
import { getFile } from "@/helpers/imageUtils";

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
      <label htmlFor="term" className="block text-sm font-medium text-primary">
        Upload Image:
      </label>
      {!value && (
        <input
          onChange={handleFileChange}
          type="file"
          accept={"image/*"}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      )}

      {value && (
        <div className="relative w-[120px]">
          {/* {value}{" "} */}
          <img
            alt="src"
            className="object-scale-down h-full m-auto w-[100px]"
            src={getFile(FLASK_CARD_BUCKET, value)}
          />
          <button className="absolute right-0 top-0" type="button" onClick={() => change("")}>
            <Icons.trash />
          </button>
        </div>
      )}
    </div>
  );
};

export default Uploader;
