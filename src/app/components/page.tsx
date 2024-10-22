"use client";

import CommonAudioRecorder from "@/components/common/common-audio-recorder";
import { useClientAuthStore } from "@/stores/authentication";
import { redirect } from "next/navigation";
import { TabView, TabPanel, TabViewProps } from "primereact/tabview";

import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import CommonAudioUploader from "@/components/common/common-audio-uploader";
import { useLocalStorage } from "usehooks-ts";
import React, { useState, useRef } from "react";
const audioLink =
  "https://skvnrwmwmcvsevknedhm.supabase.co/storage/v1/object/public/flashcard/audio/file_1727614514685_e7n172.mp3";
const AudioDownloaderAndPlayer = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  // Function to download audio and convert to blob
  const downloadAudio = async () => {
    console.log("Download 1");
    try {
      // const response = await fetch(audioLink);
      // console.log("Download 2", response);
      // const audioBlob = await response.blob();
      // console.log("Download 3");
      // // Convert blob to an object URL
      // const url = URL.createObjectURL(audioBlob);
      // // setAudioUrl(url);
      // console.log("Download 4", url);
      // // // Optional: Autoplay the audio after download
      // // playAudio(url);

      // const audio = new Audio();
      // // audio.autoplay = true;
      // console.log("Download 5");
      // audio.src = url;
      // console.log("Download 6");
      // audio.load();
      // console.log("Download 7");
      // console.log("Download 8", audio);
      // setTimeout(() => {
      //   audio.play();
      // }, 1000);

      const response = await window.fetch(audioLink, { mode: "cors" });
      console.log("Download 2", response);
      const audioArrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioArrayBuffer]);
      const audioObjectURL = window.URL.createObjectURL(audioBlob);
      console.log("Download 3", audioObjectURL);

      const audioElement = document.createElement("audio");

      audioElement.setAttribute("controls", true);
      // const a = document.getElementById("1231231231231231231231231231231");
      // console.log("Download 4", a);
      // if (a) {
      //   console.log("Download 5");
      //   a.appendChild(audioElement);
      //   const sourceElement = document.createElement("source");

      //   audioElement.appendChild(sourceElement);
      //   console.log("Download 6");
      //   sourceElement.src = audioObjectURL;
      //   sourceElement.type = "audio/webm";
      // }

      const audio = new Audio();
      audio.src = audioObjectURL;
      audio.load();
      setTimeout(() => {
        audio.play();
      }, 1000);
    } catch (error) {
      console.error("Error downloading audio:", error);
    }
  };

  return (
    <div>
      <button onClick={() => downloadAudio()}>Download and Play Audio</button>
      <audio controls>
        <source src={audioLink} type="audio/webm" />
        </audio>

    </div>
  );
};

const AudioPlayer = () => {
  const audioRef = useRef(null);

  // Play audio function
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed: ", error);
      });
    }
  };

  // Pause audio function
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div id="1231231231231231231231231231231">
      <audio ref={audioRef} controls>
        <source src={audioLink} type="audio/ogg" />
        <source src={audioLink} type="audio/mp3" />
        <source src={audioLink} type="audio/webm" />
        Your browser does not support the audio element.
      </audio>

      {/* User interaction buttons */}
      <button onClick={playAudio}>Play Audio</button>
      <button onClick={pauseAudio}>Pause Audio</button>
    </div>
  );
};

export default function Home() {
  const { user } = useClientAuthStore();
  if (!user) {
    redirect("/login");
  }
  const [activeIndex, setActiveIndex] = useLocalStorage<
    TabViewProps["activeIndex"]
  >("audio", undefined);
  const scrollableTabs = [
    { title: `CommonAudioRecorder`, content: <CommonAudioRecorder /> },
    { title: `CommonAudioUploader`, content: <CommonAudioUploader /> },
  ];

  return (
    <main
      className="min-h-screen p-24 md:px-24"
      id="1231231231231231231231231231231"
    >
      <AudioDownloaderAndPlayer />
      <button
        className="p-4 rounded-sm border border-stone-900"
        type="button"
        onClick={() => {
          console.log("Play");
          const audio = new Audio();
          // audio.autoplay = true;
          audio.src =
            "https://skvnrwmwmcvsevknedhm.supabase.co/storage/v1/object/public/flashcard/audio/file_1727614514685_e7n172.mp3";
          audio.load();
          setTimeout(() => {
            audio.play();
          }, 1000);
        }}
      >
        Play
      </button>
      {/* <p>
        {sound?.state()}
        {duration}
      </p> */}

      {/* <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        scrollable
      >
        {scrollableTabs.map((tab) => {
          return (
            <TabPanel key={tab.title} header={tab.title}>
              <p className="m-0">{tab.content}</p>
            </TabPanel>
          );
        })}
      </TabView> */}
    </main>
  );
}
