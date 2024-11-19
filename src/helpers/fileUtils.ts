import FlashCardService from "@/services/flashCard";
import { toast } from "react-toastify";

export function generateUniqueFileName(file: File) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8); // Random 6-character string
  const extension = getFileExtension(file);
  let prefix = "";
  // if extension is audio, add 'audio/' as prefix
  if (extension === "mp3" || extension === "wav" || extension === "webm") {
    prefix = `audio/`;
  }
  return `${prefix}file_${timestamp}_${randomString}.${extension}`;
}

function getFileExtension(file: File) {
  const fileName = file.name;
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex === -1) {
    // No file extension found
    return null;
  }

  const extension = fileName.slice(dotIndex + 1).toLowerCase();
  return extension;
}

export async function uploadFile(file: File) {
  return toast.promise(
    async () => {
      const path = generateUniqueFileName(file);
      const { data } = await FlashCardService.upload(path, file);
      if (data && data.path) {
        return data.path;
      }
      toast.error("Failed to upload file");
      return null;
    },
    {
      pending: "Uploading...",
      success: "File uploaded successfully",
      error: "Failed to upload file",
    }
  );
}

export function isImage(file: File) {
  return file.type.startsWith("image/");
}
