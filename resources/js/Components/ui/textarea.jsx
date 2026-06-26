import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-24 resize-y rounded-lg bg-transparent px-2.5 py-2 text-base transition-colors outline-none",

        // Placeholder
        "placeholder:text-[#93C5FD]",

        // Blue border
        "border border-[#BFDBFE] hover:border-[#93C5FD]",

        // Blue focus ring
        "focus-visible:border-[#3B82F6] focus-visible:ring-3 focus-visible:ring-blue-300/40",

        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",

        // Validation
        "aria-invalid:border-red-400 aria-invalid:ring-3 aria-invalid:ring-red-300/25",

        // Dark mode
        "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",

        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }