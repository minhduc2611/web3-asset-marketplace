import { isEqual } from "lodash";
import cloneDeep from "lodash.clonedeep";
import partial from "lodash.partial";
import set from "lodash.set";
import { create } from "zustand";
import { combine } from "zustand/middleware";

import { FormikValues } from "formik";

import * as Yup from "yup";

// inspiration
// https://codesandbox.io/p/sandbox/react-zustand-form-q0csf?file=%2Fsrc%2Fschemas%2Fcontact_schema.ts%3A1%2C1-14%2C1

type Value = string | number | boolean | Object;
type ValueSetter = Record<string, Value>;
const useStore = create(
  combine(
    {
      formMap: {} as { [key: string]: { [key: string]: Value } },
      formValidationMap: {} as { [key: string]: boolean },
      formErrorMap: {} as { [key: string]: { [key: string]: string } },
      schemaMap: {} as { [key: string]: Yup.AnyObject },
      actionMap: {} as { [key: string]: Object },
    },
    (set) => ({
      set,
    })
  )
);
const useFormValues = (formKey: string) =>
  useStore(
    (s) => s.formMap[formKey],
    (s0, s1) => isEqual(s0, s1)
  );

const useFormValidation = (formKey: string) =>
  useStore((s) => s.formValidationMap[formKey]);

const getInitValues = (formKey: string) => useStore.getState().formMap[formKey];

const getSchema = (key: string) => useStore.getState().schemaMap[key];
const getActions = (key: string) => useStore.getState().actionMap[key];

const useFormKeys = () =>
  useStore(
    (s) => Object.keys(s.formValidationMap),
    (s0, s1) => s0.length === s1.length
  );

const updateGlobalState = (formKey: string, newVals: ValueSetter) => {
  const prevState = useStore.getState();
  // const schema = prevState.schemaMap[formKey];
  // schema;
  // if (schema) {
  const newOne = cloneDeep(prevState.formMap[formKey]);
  Object.keys(newVals).forEach((key) => {
    set(newOne, key, newVals[key]);
  });
  console.log("prevState.formMap", prevState.formMap);

  prevState.formMap[formKey] = newOne //{ ...prevState.formMap[formKey], ...newOne };
  // prevState.formMap[formKey] = { ...prevState.formMap[formKey], ...newVals };
  console.log("prevState.formMap[formKey]", prevState.formMap[formKey]);
  useStore.setState({
    // formValidationMap: prevState.formValidationMap,
    formMap: prevState.formMap,
    // formErrorMap: prevState.formErrorMap,
  });
  // set
  // prevState.schemaMap[formKey]
  //   .validate(newVals, { stripUnknown: true }) //, { abortEarly: false }
  //   .then((isValid: boolean) => {})
  //   .catch((err: Yup.ValidationError) => {
  //     const errors: Record<string, string[]> = {};

  //     err.inner.forEach((element) => {
  //       // Path is undefined when the error relates to the root object
  //       const path = element.path || "root";
  //       // compile errors for same field into one array
  //       errors[path]
  //         ? errors[path].push(element.message)
  //         : (errors[path] = [element.message]);
  //     });
  //     //
  //     // err.inner.forEach((e) => console.log("errors ==> ", e.message, e.path));
  //     // console.log("errors ==> ", prevState.formMap[formKey]);

  //     prevState.formErrorMap[formKey] = {
  //       ...prevState.formErrorMap[formKey],
  //       [err.path as string]: err.message,
  //     };
  //   })
  //   .finally(() => {
  //     useStore.setState({
  //       formValidationMap: prevState.formValidationMap,
  //       formMap: prevState.formMap,
  //       formErrorMap: prevState.formErrorMap,
  //     });
  //   });

  // }
};

const deleteForm = (key: string) => {
  const prev = useStore.getState();
  delete prev.formValidationMap[key];
  delete prev.formMap[key];

  useStore.setState({
    formValidationMap: prev.formValidationMap,
    formMap: prev.formMap,
  });
};

const deleteAllForms = () => {
  useStore.setState({
    formValidationMap: {},
    formMap: {},
  });
};

const addBlankForm = <T, A>(
  key: string,
  defaultValues: T,
  actions: A,
  schema?: Yup.AnyObject
) => {
  // const key = uniqueNamesGenerator({
  //   dictionaries: [adjectives, colors, animals],
  //   length: 2,
  // });

  const values = defaultValues;

  const prevState = useStore.getState();
  prevState.formValidationMap[key] = false;
  prevState.formMap[key] = values as ValueSetter; // todo not only string
  if (schema) {
    prevState.schemaMap[key] = schema;
  }

  if (actions) {
    prevState.actionMap[key] = actions;
  }

  useStore.setState({
    formValidationMap: prevState.formValidationMap,
    formMap: prevState.formMap,
  });
};

interface CreateZustandForm<T extends Yup.AnyObject, A> {
  id: string;
  state: () => T;
  actions: (setter: (value: ValueSetter & Partial<T>) => void, getter: () => T) => A;
  // schema?: Yup.ObjectSchema<RequiredFieldsOnly<T>>;
}

type ZustandFormReturn<T, A> = () => {
  values: T;
  setValues: (newVals: ValueSetter) => void;
} & A;

const createForm = <T extends FormikValues, A>({
  id: key,
  state: defaultValues,
  // schema,
  actions,
}: CreateZustandForm<T, A>): ZustandFormReturn<T, A> => {
  /** if there is not a form, create it, this prevent multiple creation */
  const formState = useStore.getState();
  if (!formState.formMap[key]) {
    const setter = partial(zustandForm.updateGlobalState, key);
    const getter = () => {
      const prevState = useStore.getState();
      return prevState.formMap[key] as T;
    };
    addBlankForm<T, A>(key, defaultValues(), actions(setter, getter));
  }
  const userDeclaredActions = getActions(key) as A;
  // lam  2 form duoc khong
  return () => ({
    // formik: useFormik<T>({
    //   initialValues: state(),
    //   validationSchema: schema,
    //   onSubmit: (_) => {},
    //   validate: (newVals: any) => zustandForm.updateGlobalState(key, newVals),
    //   validateOnChange: true,
    // }),
    values: useFormValues(key) as T,
    ...userDeclaredActions,
    // formState: { errors }, // todo
    setValues: (newVals: ValueSetter) => {
      zustandForm.updateGlobalState(key, newVals);
      console.log("gegt state", useStore.getState().formMap);
    },
  });
};

export const zustandForm = {
  create: createForm,
  useStore,
  useFormValues,
  useFormValidation,
  getInitValues,
  getSchema,
  useAllFormKeys: useFormKeys,
  addBlankForm,
  updateGlobalState,
  deleteForm,
  deleteAllForms,
};
