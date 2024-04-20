"use client";
import { Icons } from "@/components/common/icons";
import { useTinderStore } from "../store/tinder";

const TinderCardController = () => {
  const store = useTinderStore();
  return (
    <div>
      <div className="h-24 flex items-center gap-6 justify-center">
        <Icons.tinderUnlike className="hover:scale-105 active:animate-[wiggle_1s_ease-in-out_infinite]" />
        <Icons.tinderSuperLike className="hover:scale-105 active:animate-[wiggle_1s_ease-in-out_infinite]" />
        <Icons.tinderLike className="hover:scale-105 active:animate-[wiggle_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default TinderCardController;
