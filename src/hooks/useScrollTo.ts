import { useRef } from "react";

const useScrollTo = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const scrollTo = (target: number = 0) => {
    divRef.current && divRef.current.scrollTo({ top: target, behavior: "smooth" });
  };
  return {divRef, scrollTo};
};

export default useScrollTo;
