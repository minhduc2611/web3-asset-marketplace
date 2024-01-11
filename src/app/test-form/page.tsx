"use client";

import TipTapEditor from "@/components/common/common-tiptap/TiptapEditor";
import useTestForm from "@/hooks/test-form/useTestForm";
import { zustandForm } from "@/lib/zustand-form";
import { ContactFormState, useContactStore } from "@/stores/test";
import React, { useRef, useState } from "react";

export default function Home() {
  const { fields, setValues: setValue, values, changeFirstName } = useTestForm();
  // const formFields = Object.keys(formik.initialValues ?? {});
  const ref = useRef(null)
  const getField = (fieldKey: string) => {
    return (
      <div
        key={fieldKey}
        style={{
          display: "flex",
          flexDirection: "column",
          height: 75,
          marginTop: 20,
        }}
      >
        <label htmlFor={fieldKey}>{fieldKey}</label>

        <input
          id={fieldKey}
          name={fieldKey}
          type="text"
          onChange={(e) => setValue({ [fieldKey]: e.target.value })}
          value={values[fieldKey]}
        />

        {/* {form.errors[fieldKey] && (
          <div style={{color: 'red'}}>
            {'Error: ' + form.errors[fieldKey]}
          </div>
        )} */}
      </div>
    );
  };
console.log('remder')
  const [editorState, setEditorState] = useState<string>("");

  return (
    <main className="min-h-screen p-10 md:p-24">
      <button onClick={() => changeFirstName("ho")}>changeFirstName</button>
      <form>{Object.keys(fields).map((k) => getField(k))}</form>
      <TipTapEditor ref={ref} value={editorState} onChange={setEditorState}/>
      <input value={editorState}  onChange={(e) => setEditorState(e.target.value)} />
      <button onClick={() => setEditorState('')}>delete</button>
    </main>
  );
}

function Home2() {
  //   const { set } = useContactStore();

  return <main className="min-h-screen p-10 md:p-24">2</main>;
}
