"use client";
import { useTinderStore } from "../store/tinder";
import TinderCardController from "./TinderCardController";
import TinderCardStack from "./TinderCardStack";
import { useEffectOnce } from "@/hooks/useEffectOnce";
const TinderBase = () => {
  const { initiatePage } = useTinderStore();

  useEffectOnce(() => {
    initiatePage();
  });

  return (
    <div className="h-full w-full flex flex-col justify-end flex-grow mt-6">
        <TinderCardStack />
        <TinderCardController />
    </div>
  );
};

export default TinderBase;
