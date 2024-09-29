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

export default function Home() {
  const { user } = useClientAuthStore();
  if (!user) {
    redirect("/login");
  }
  const [activeIndex, setActiveIndex] = useLocalStorage<TabViewProps['activeIndex']>("audio", undefined);
  const scrollableTabs = [
    { title: `CommonAudioRecorder`, content: <CommonAudioRecorder /> },
    { title: `CommonAudioUploader`, content: <CommonAudioUploader /> },
  ];
  return (
    <main className="min-h-screen p-24 md:px-24">
      <TabView
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
      </TabView>
    </main>
  );
}
