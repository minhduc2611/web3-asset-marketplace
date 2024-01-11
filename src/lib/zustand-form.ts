import { isEqual } from "lodash";
import partial from "lodash.partial";
import { create } from "zustand";
import { combine } from "zustand/middleware";
// import {
//   adjectives,
//   colors,
//   animals,
//   uniqueNamesGenerator,
// } from 'unique-names-generator'
import { FormikValues, useFormik } from "formik";

import * as Yup from "yup";
import { RequiredFieldsOnly } from "@/types/common";
const useStore = create(
  combine(
    {
      formMap: {} as { [key: string]: { [key: string]: string } },
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

const updateGlobalState = (
  formKey: string,
  newVals: Record<string, string>
) => {
  const prevState = useStore.getState();
  const schema = prevState.schemaMap[formKey];
  schema;
  if (schema) {
    // console.log("schema", prevState.schemaMap[formKey], newVals);

    let formValues = prevState.formMap[formKey];
    prevState.formMap[formKey] = { ...formValues, ...newVals };
    console.log("newVals", newVals);

    prevState.schemaMap[formKey]
      .validate(newVals, { stripUnknown: true }) //, { abortEarly: false }
      .then((isValid: boolean) => {})
      .catch((err: Yup.ValidationError) => {
        const errors: Record<string, string[]> = {};

        err.inner.forEach((element) => {
          // Path is undefined when the error relates to the root object
          const path = element.path || "root";
          // compile errors for same field into one array
          errors[path]
            ? errors[path].push(element.message)
            : (errors[path] = [element.message]);
        });
        //
        // err.inner.forEach((e) => console.log("errors ==> ", e.message, e.path));
        // console.log("errors ==> ", prevState.formMap[formKey]);

        prevState.formErrorMap[formKey] = {
          ...prevState.formErrorMap[formKey],
          [err.path as string]: err.message,
        };

        console.log(
          "prevState.formErrorMap[formKey]",
          prevState.formErrorMap[formKey]
        );
      })
      .finally(() => {
        // prevState.formValidationMap[formKey] = isValid;
        // console.log("form is valid", isValid);

        useStore.setState({
          formValidationMap: prevState.formValidationMap,
          formMap: prevState.formMap,
          formErrorMap: prevState.formErrorMap,
        });
      });
  }
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
  prevState.formMap[key] = values as Record<string, string>; // todo not only string
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
  actions: (setter: (value: Record<string, string>) => void) => A;
  schema?: Yup.ObjectSchema<RequiredFieldsOnly<T>>;
}

const createForm = <T extends FormikValues, A>({
  id: key,
  state: defaultValues,
  schema,
  actions,
}: CreateZustandForm<T, A>) => {
  /** if there is not a form, create it, this prevent multiple creation */
  const formState = useStore.getState();
  if (!formState.formMap[key]) {
    const setter = partial(zustandForm.updateGlobalState, key);
    addBlankForm<T, A>(key, defaultValues(), actions(setter), schema);
  }
  const _actions = getActions(key) as A;
  // lam  2 form duoc khong
  return () => ({
    // formik: useFormik<T>({
    //   initialValues: state(),
    //   validationSchema: schema,
    //   onSubmit: (_) => {},
    //   validate: (newVals: any) => zustandForm.updateGlobalState(key, newVals),
    //   validateOnChange: true,
    // }),
    values: useFormValues(key),
    ..._actions,
    // formState: { errors }, // todo
    setValues: (newVals: Record<string, string>) => {
      console.log('setValues setValues')
      zustandForm.updateGlobalState(key, newVals);
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
