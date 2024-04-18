"use client";
import { useTinderStore } from "../store/tinder";

const TinderCardController = () => {
  const store = useTinderStore();
  return (
    <div className="h-40">
      <button type="button" onClick={store.nextUser}>
        nextUser
      </button>
    </div>
  );
};

export default TinderCardController;
