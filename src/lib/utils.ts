import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { ClassValue, clsx } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Options = {
    successMessage?: string;
    successCallback?: () => void;
}

export const handleError = (response: PostgrestSingleResponse<any>, options: Options) => {
  if (!response.error) {
    toast.success(options.successMessage, {
      position: "top-center",
    });
    options.successCallback && options.successCallback();
  } else {
    console.error('response', response);
    let message = ''

    switch (response.status) {
      case 0:
        message = "Network Error";
        break;
      case 400:
        message = response.error.message;
        break;
      case 401:
        message = "Unauthorized";
        break;
      case 403:
        message = "Forbidden, you don't have permission to access this resource";
        break;
      default:
        message = response.error.message;
        break;
    }


    toast.error(message, { position: "top-center" });


  }
};
