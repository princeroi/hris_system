import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-3 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link:
          "text-primary underline-offset-4 hover:underline",

        // ── Filled ────────────────────────────────────────────────────────────
        success:
          "bg-green-100 text-green-800 border-transparent dark:bg-green-900 dark:text-green-300",
        warning:
          "bg-yellow-100 text-yellow-800 border-transparent dark:bg-yellow-900 dark:text-yellow-300",
        danger:
          "bg-red-100 text-red-800 border-transparent dark:bg-red-900 dark:text-red-300",
        info:
          "bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900 dark:text-blue-300",

        // ── Outlined ──────────────────────────────────────────────────────────
        "success-outline":
          "bg-transparent border-green-500 text-green-700 dark:border-green-600 dark:text-green-400",
        "warning-outline":
          "bg-transparent border-yellow-500 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400",
        "danger-outline":
          "bg-transparent border-red-500 text-red-700 dark:border-red-600 dark:text-red-400",
        "info-outline":
          "bg-transparent border-blue-500 text-blue-700 dark:border-blue-600 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants }