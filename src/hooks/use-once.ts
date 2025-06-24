"use client"

import { useEffect, useRef } from "react"

/**
 * A hook that ensures an effect runs only once, even in React's Strict Mode.
 * This is useful for initialization logic that should only run once.
 * 
 * @param effect The effect to run once
 * @param deps The dependencies array for the effect
 */
export function useOnce(effect: () => void | (() => void), deps: unknown[] = []) {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true
      return effect()
    }
  }, deps)
} 