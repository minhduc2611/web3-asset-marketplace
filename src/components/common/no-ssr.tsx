"use client";
import useEnhancedEffect from "@/hooks/useEnhancedEffect";
import { useEffect, useState } from "react";

export interface NoSsrProps {
  /**
   * You can wrap a node.
   */
  children?: React.ReactNode;
  /**
   * If `true`, the component will not only prevent server-side rendering.
   * It will also defer the rendering of the children into a different screen frame.
   * @default false
   */
  defer?: boolean;
  /**
   * The fallback content to display.
   * @default null
   */
  fallback?: React.ReactNode;
}

function NoSsr(props: NoSsrProps): React.JSX.Element {
  const { children, defer = false, fallback = null } = props;
  const [mountedState, setMountedState] = useState(false);

  useEnhancedEffect(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);

  useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);

  // TODO casting won't be needed at one point https://github.com/DefinitelyTyped/DefinitelyTyped/pull/65135
  return (mountedState ? children : fallback) as React.JSX.Element;
}

export default NoSsr;
