import * as React from "react"
import { Plus, Minus } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const isMobile = useIsMobile()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isNumberInput = type === "number"
  const showMobileButtons = isNumberInput && isMobile

  const handleIncrement = () => {
    if (inputRef.current) {
      const currentValue = parseFloat(inputRef.current.value) || 0
      const step = parseFloat(inputRef.current.step) || 1
      const max = inputRef.current.max ? parseFloat(inputRef.current.max) : undefined
      const newValue = currentValue + step
      
      if (max === undefined || newValue <= max) {
        const newValueString = newValue.toString()
        inputRef.current.value = newValueString
        
        // Trigger React onChange event
        if (props.onChange) {
          const syntheticEvent = {
            target: { ...inputRef.current, value: newValueString },
            currentTarget: inputRef.current,
          } as React.ChangeEvent<HTMLInputElement>
          props.onChange(syntheticEvent)
        }
      }
    }
  }

  const handleDecrement = () => {
    if (inputRef.current) {
      const currentValue = parseFloat(inputRef.current.value) || 0
      const step = parseFloat(inputRef.current.step) || 1
      const min = inputRef.current.min ? parseFloat(inputRef.current.min) : undefined
      const newValue = currentValue - step
      
      if (min === undefined || newValue >= min) {
        const newValueString = newValue.toString()
        inputRef.current.value = newValueString
        
        // Trigger React onChange event
        if (props.onChange) {
          const syntheticEvent = {
            target: { ...inputRef.current, value: newValueString },
            currentTarget: inputRef.current,
          } as React.ChangeEvent<HTMLInputElement>
          props.onChange(syntheticEvent)
        }
      }
    }
  }

  if (showMobileButtons) {
    return (
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "pr-20", // Add padding for the buttons
            className
          )}
                     {...props}
        />
        <div className="absolute right-1 flex items-center gap-1">
          <button
            type="button"
            onClick={handleDecrement}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-muted hover:bg-muted/80 transition-colors"
            tabIndex={-1}
          >
            <Minus className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleIncrement}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-muted hover:bg-muted/80 transition-colors"
            tabIndex={-1}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
