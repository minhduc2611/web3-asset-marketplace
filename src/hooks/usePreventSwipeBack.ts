import { useIsomorphicLayoutEffect } from "usehooks-ts";

export const usePreventSwipeBack = () => {
  useIsomorphicLayoutEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
};
