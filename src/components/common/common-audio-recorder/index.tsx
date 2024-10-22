"use client";
import { getFile } from "@/helpers/imageUtils";
import { FLASK_CARD_BUCKET } from "@/services/flashCard";
import { memo } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { Icons } from "../icons";
// import ff from "@ffmpeg/ffmpeg";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
const SoundPlayer = ({ url }: { url: string }) => {
  return (
    <audio controls>
      <source src={url} type="audio/mpeg" />
      <source src={url} type="audio/ogg" />
    </audio>
  );
};
interface CommonAudioRecorderProps {
  initialValue?: string;
  value?: File;
  onChange?: (file?: File) => void;
}

const convertToMP3 = async (blob: Blob) => {
  // turn blob into a file by ffmpeg in audio/mpeg format
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();
  const data = await fetchFile(blob);
  await ffmpeg.writeFile("input.wav", data);
  // // ffmpeg -i audio.avi audio.mp3
  await ffmpeg.exec(["-i", "input.wav", "audio.mp3"]);
  const output = await ffmpeg.readFile("audio.mp3");
  const mp3Blob = new Blob([output], { type: "audio/mpeg" });
  return new File([mp3Blob], "recorded.mp3", { type: "audio/mpeg" });
};

const CommonAudioRecorder = (props: CommonAudioRecorderProps) => {
  const onRecordDone = async (blob: Blob) => {
    const convertedFile = await convertToMP3(blob);
    console.log("Converted MP3 file: ", convertedFile);
    props.onChange && props.onChange(convertedFile);
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
        downloadFileExtension="mp3"
      />
      {props.value && (
        <div id="audio-review">
          {/* <audio controls preload="metadata">
            <source src={URL.createObjectURL(props.value)} type="audio/mpeg" />
            <source src={URL.createObjectURL(props.value)} type="audio/ogg" />
            not support
          </audio> */}
          <SoundPlayer url={URL.createObjectURL(props.value)} />

          <p>{props.value.name}</p>
        </div>
      )}
      {props.initialValue && (
        <div className="flex">
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
