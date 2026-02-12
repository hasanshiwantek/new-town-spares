import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "!text-lg !md:text-lg w-full max-w-md h-13 px-4 py-4   rounded-sm bg-white transition-colors text-[#333333]",

        // Default border #d7d6d9
        "border border-[#d1d0d4]",

        // Hover #86848c
        "hover:border-[#86848c]",

        // Focus
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-300 focus-visible:border-orange-500",

        // Dark mode & placeholder
        "dark:bg-input/30 placeholder:text-gray-400 file:text-foreground !font-[520]",

        // Validation & accessibility
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:h-7",

        className
      )}
      {...props}
    />
  );
}

export { Input };
