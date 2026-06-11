import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",

        // Placeholder — readable blue-gray
        "placeholder:text-[#93C5FD]",

        // Blue border
        "border border-[#BFDBFE] hover:border-[#93C5FD]",

        // Blue focus ring
        "focus-visible:border-[#3B82F6] focus-visible:ring-3 focus-visible:ring-blue-300/40",

        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        "aria-invalid:border-red-400 aria-invalid:ring-3 aria-invalid:ring-red-300/25",
        "md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }