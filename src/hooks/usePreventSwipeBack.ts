import { useIsomorphicLayoutEffect } from "usehooks-ts";

export const usePreventSwipeBack = () => {
    useIsomorphicLayoutEffect(() => {
        if (window.safari) {
          history.pushState(null, null, location.href);
          window.onpopstate = function (event) {
            history.go(1);
          };
        }
        return () => {
            
        }
    }, [])
};
