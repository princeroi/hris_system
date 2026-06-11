import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Typography
        "block text-[11px] font-semibold uppercase tracking-[0.08em]",
        // Color — dark navy, not harsh black, not washed-out blue
        "text-[#1E3A8A]",
        // Spacing — enough air between label and input
        "mb-1.5 leading-none select-none",
        // Disabled states
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-40",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Label }