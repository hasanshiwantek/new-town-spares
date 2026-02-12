"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base appearance
        "peer size-7 shrink-0 rounded-md border border-gray-400 bg-white shadow-xs cursor-pointer",

        // Checked state
        "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400 data-[state=checked]:text-white",

        // Ring + focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",

        // Smooth transitions
        "transition-all duration-200 ease-in-out",

        // Disabled and accessibility
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500",

        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-transform duration-200"
      >
        <CheckIcon className="h-6 w-10 font-bold text-white"  strokeWidth={3}  />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
