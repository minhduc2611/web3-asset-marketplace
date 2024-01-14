import { zustandForm } from "@/lib/zustand-form";
import * as Yup from "yup";

export interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
}
interface Actions {
    changeFirstName: (name: string) => void
}
export const useCardFormStore = zustandForm.create<ContactFormState, Actions>({
  id: "contact-store",
  // schema: Yup.object({
  //   firstName: Yup.string()
  //     .max(15, "Must be 15 characters or less")
  //     .required("Required"),
  //   lastName: Yup.string()
  //     .max(20, "Must be 20 characters or less")
  //     .required("Required"),
  //   email: Yup.string().email("Invalid email address").required("Required"),
  // }),
  state: () => ({
    firstName: "",
    lastName: "",
    email: "",
  }),
  actions: (set) => ({
    changeFirstName(name: string) {
      set({ firstName: name });
    },
  }),
});
