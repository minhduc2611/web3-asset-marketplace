import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

function useKeyControls(
  { current }: MutableRefObject<Record<GameControl, boolean>>,
  map: Record<KeyCode, GameControl>,
) {
  useEffect(() => {
    const handleKeydown = ({ key }: KeyboardEvent) => {
      if (!isKeyCode(key)) return
      current[map[key]] = true
    }
    window.addEventListener('keydown', handleKeydown)
    const handleKeyup = ({ key }: KeyboardEvent) => {
      if (!isKeyCode(key)) return
      current[map[key]] = false
    }
    window.addEventListener('keyup', handleKeyup)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyup)
    }
  }, [current, map])
}

type KeyCode = keyof typeof keyControlMap
