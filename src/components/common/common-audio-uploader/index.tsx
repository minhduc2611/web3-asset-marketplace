"use client";
import { Button } from "primereact/button";

interface CommonAudioUploaderProps {
  haveReview?: boolean;
  onUpload?: (blob: Blob) => void;
}

const CommonAudioUploader = (props: CommonAudioUploaderProps) => {
  const upload = () => {
    // create a input file element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    // input.onchange = (e) => {
    //   const file = e.target.files[0];
    //   props.onUpload && props.onUpload(file);
    //   input.remove();
    // };
    // click it 
    input.click();
    // get the file
    const file = input.files && input.files[0];
  }
  return (
    <div>
      <Button
        icon="pi pi-bookmark"
        rounded
        text
        raised
        severity="secondary"
        aria-label="Bookmark"
      />
    </div>
  );
};

export default CommonAudioUploader;
