import { FormStatus } from "@/enum/common";
import { zustandForm } from "@/lib/zustand-form";
import * as Yup from "yup";

export interface FlashCardRegisterFormState {
  id?: number;
  term: string;
  definition: string;
  media_url: string;

  status?: FormStatus;
}

interface Actions {
  changeFirstName: (name: string) => void;
  submit: () => void
}

export const createInitialValues = () => {
  return {
    id: 0,
    term: "",
    definition: "",
    media_url: "",

    status: FormStatus.Add,
  };
};

export const useFlashCardRegisterStore = zustandForm.create<FlashCardRegisterFormState, Actions>({
  id: "contact-store",
  schema: Yup.object({
    term: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    definition: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    media_url: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
  }),
  state: createInitialValues,
  actions: (set) => ({
    changeFirstName(name: string) {
      set({ firstName: name });
    },
    submit: ()  => {}
  }),
});
