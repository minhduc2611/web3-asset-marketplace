"use client";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { usePreventSwipeBack } from "@/hooks/usePreventSwipeBack";
import { useTinderStore } from "@/module/tinder/store/tinder";
import TinderCardStack from "@/module/tinder/components/TinderCardStack";
const TinderBase = () => {
  const { initiatePage } = useTinderStore();

  useEffectOnce(() => {
    initiatePage();
  });

  usePreventSwipeBack();

  return (
    <div className="h-full w-full flex flex-col justify-end flex-grow mt-6 max-w-xl">
      <TinderCardStack />
    </div>
  );
};

export default TinderBase;
