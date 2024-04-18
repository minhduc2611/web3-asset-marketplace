import { EffectCallback, useEffect, useRef } from 'react'

export function useEffectOnce(effect: EffectCallback) {
  const ref = useRef(0);
  useEffect(() => {
    if (ref.current === 0) {
      ref.current = 1;
      effect();
    }
  }, []);
}
