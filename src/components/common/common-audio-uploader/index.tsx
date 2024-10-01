"use client";
import { Button } from "primereact/button";

interface CommonAudioUploaderProps {
  haveReview?: boolean;
  onUpload?: (blob: Blob) => void;
}

const CommonAudioUploader = (props: CommonAudioUploaderProps) => {
  const upload = () => {
    // create a input file element
   const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    
    // click it 
    input.click();
    // get the file
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const blob = new Blob([new Uint8Array(e.target?.result as ArrayBuffer)], { type: 'audio/webm' });
        props.onUpload && props.onUpload(blob);
      };
      reader.readAsArrayBuffer(file);
    }
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
