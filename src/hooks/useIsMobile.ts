import { useDeviceSelectors } from "react-device-detect";

const useIsMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);
  const { isMobile } = selectors;
  return isMobile;
};

export default useIsMobile;
