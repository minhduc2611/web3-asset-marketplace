"use client";
import { getFile } from "@/helpers/imageUtils";
import { FLASK_CARD_BUCKET } from "@/services/flashCard";
import { memo } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { Icons } from "../icons";

const SoundPlayer = ({ url }: { url: string }) => {
  return (
    <audio controls>
      <source src={url} type="audio/webm" />
      <source src={url} type="audio/ogg" />
    </audio>
  );
};
interface CommonAudioRecorderProps {
  initialValue?: string;
  value?: File;
  onChange?: (file?: File) => void;
}

const CommonAudioRecorder = (props: CommonAudioRecorderProps) => {
  const onRecordDone = (blob: Blob) => {
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
          {/* <audio controls preload="metadata">
            <source src={URL.createObjectURL(props.value)} type="audio/webm" />
            <source src={URL.createObjectURL(props.value)} type="audio/ogg" />
            not support
          </audio> */}
          <SoundPlayer url={URL.createObjectURL(props.value)} />

          <p>{props.value.name}</p>
        </div>
      )}
      {props.initialValue && (
        <div className="flex">
          {/* <audio controls preload="metadata">
            <source
              src={getFile(FLASK_CARD_BUCKET, props.initialValue)}
              type="audio/webm"
            />
            <source
              src={getFile(FLASK_CARD_BUCKET, props.initialValue)}
              type="audio/ogg"
            />
            not support
          </audio> */}
          <SoundPlayer url={getFile(FLASK_CARD_BUCKET, props.initialValue)} />

          <button
            type="button"
            onClick={() => props.onChange && props.onChange()}
          >
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
