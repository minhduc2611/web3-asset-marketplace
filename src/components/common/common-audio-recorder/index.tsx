"use client";
import { getFile } from "@/helpers/imageUtils";
import { FLASK_CARD_BUCKET } from "@/services/flashCard";
import { memo } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { Icons } from "../icons";

interface CommonAudioRecorderProps {
  initialValue?: string;
  value?: File;
  onChange?: (file?: File) => void;
}

const CommonAudioRecorder = (props: CommonAudioRecorderProps) => {
  console.log("RERENDER ", props);
  // const addAudioElement = (blob: Blob) => {
  //   const url = URL.createObjectURL(blob);
  //   const audio = document.createElement("audio");
  //   audio.src = url;
  //   audio.controls = true;
  //   document.getElementById('audio-review')?.appendChild(audio);
  // };
  const onRecordDone = (blob: Blob) => {
    // mp3 extension
    var file = new File([blob], "recorded.mp3", {
      type: "audio/webm",
      lastModified: Date.now(),
    });
    console.log("file ", file);
    props.onChange && props.onChange(file);
  };
  return (
    <div>
      <AudioRecorder
        onRecordingComplete={onRecordDone}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={false}
        downloadFileExtension="webm"
      />
      {props.value && (
        <div id="audio-review">
          <audio src={URL.createObjectURL(props.value)} controls />
          <p>{props.value.name}</p>
        </div>
      )}
      {props.initialValue && (
        <div className="flex">
          <audio src={getFile(FLASK_CARD_BUCKET, props.initialValue)} controls>
            <Icons.post />
          </audio>
          <button type="button" onClick={() => props.onChange && props.onChange()}>
            <Icons.trash />
          </button>
        </div>
      )}
    </div>
  );
};
function arePropsEqual(
  oldProps: Readonly<CommonAudioRecorderProps>,
  newProps: Readonly<CommonAudioRecorderProps>
) {
  return (
    oldProps.value === newProps.value &&
    oldProps.initialValue === newProps.initialValue
  );
}

export default memo(CommonAudioRecorder, arePropsEqual);
