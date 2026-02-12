"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.3rem] w-14 shrink-0 items-center rounded-full border border-transparent",
        "transition-colors duration-300 ease-in-out shadow-sm outline-none cursor-pointer",
        "bg-gray-300 data-[state=checked]:bg-blue-400",
        "ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-8 w-8 rounded-full bg-white shadow-md ring-0",
          "transition-transform duration-300 ease-in-out transform",
          "data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-blue-600",
          "data-[state=checked]:scale-110 data-[state=unchecked]:scale-100"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
