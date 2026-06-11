import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "rounded-lg border border-transparent bg-clip-padding",
    "font-medium whitespace-nowrap select-none",
    "transition-all duration-150 outline-none",
    "focus-visible:border-blue-400 focus-visible:ring-3 focus-visible:ring-blue-300/50",
    "active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-45",
    "aria-invalid:border-red-400 aria-invalid:ring-3 aria-invalid:ring-red-300/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Solid brand blue (default) ───────────────────────────────
        default: [
          "bg-[#1D4ED8] text-white border-transparent",
          "hover:bg-[#1E40AF]",
          "active:bg-[#1E3A8A]",
          "shadow-sm shadow-blue-900/20",
        ].join(" "),

        // ── Blue-bordered outline ────────────────────────────────────
        outline: [
          "border-[#BFDBFE] bg-white text-[#1D4ED8]",
          "hover:bg-[#EFF6FF] hover:border-[#93C5FD]",
          "aria-expanded:bg-[#EFF6FF]",
          "dark:border-[#1E3A6E] dark:bg-[#0F1E3D]/40 dark:text-[#93C5FD]",
          "dark:hover:bg-[#1E3A6E]/60",
        ].join(" "),

        // ── Soft blue fill ───────────────────────────────────────────
        secondary: [
          "bg-[#DBEAFE] text-[#1E3A6E] border-transparent",
          "hover:bg-[#BFDBFE]",
          "aria-expanded:bg-[#DBEAFE]",
        ].join(" "),

        // ── No border, blue text on hover ────────────────────────────
        ghost: [
          "text-[#374151]",
          "hover:bg-[#EFF6FF] hover:text-[#1D4ED8]",
          "aria-expanded:bg-[#EFF6FF] aria-expanded:text-[#1D4ED8]",
          "dark:hover:bg-[#1E3A6E]/50 dark:hover:text-[#93C5FD]",
        ].join(" "),

        // ── Destructive ──────────────────────────────────────────────
        destructive: [
          "bg-red-50 text-red-600 border-transparent",
          "hover:bg-red-100",
          "focus-visible:border-red-400/40 focus-visible:ring-red-300/20",
          "dark:bg-red-900/20 dark:text-red-400",
          "dark:hover:bg-red-900/30",
        ].join(" "),

        // ── Success ──────────────────────────────────────────────────
        success: [
          "bg-emerald-600 text-white border-transparent",
          "hover:bg-emerald-700",
          "active:bg-emerald-800",
          "shadow-sm shadow-emerald-900/20",
          "focus-visible:border-emerald-400 focus-visible:ring-emerald-300/50",
          "dark:bg-emerald-500 dark:hover:bg-emerald-600",
        ].join(" "),

        // ── Success outline ──────────────────────────────────────────
        "success-outline": [
          "border-emerald-200 bg-white text-emerald-700",
          "hover:bg-emerald-50 hover:border-emerald-300",
          "focus-visible:border-emerald-400 focus-visible:ring-emerald-300/50",
          "dark:border-emerald-800 dark:bg-transparent dark:text-emerald-400",
          "dark:hover:bg-emerald-900/30",
        ].join(" "),

        // ── Warning ──────────────────────────────────────────────────
        warning: [
          "bg-amber-400 text-amber-900 border-transparent",
          "hover:bg-amber-500",
          "active:bg-amber-600",
          "shadow-sm shadow-amber-900/20",
          "focus-visible:border-amber-400 focus-visible:ring-amber-300/50",
          "dark:bg-amber-500 dark:text-amber-950 dark:hover:bg-amber-400",
        ].join(" "),

        // ── Warning outline ──────────────────────────────────────────
        "warning-outline": [
          "border-amber-200 bg-white text-amber-700",
          "hover:bg-amber-50 hover:border-amber-300",
          "focus-visible:border-amber-400 focus-visible:ring-amber-300/50",
          "dark:border-amber-700 dark:bg-transparent dark:text-amber-400",
          "dark:hover:bg-amber-900/30",
        ].join(" "),

        // ── Danger (solid red) ───────────────────────────────────────
        danger: [
          "bg-red-600 text-white border-transparent",
          "hover:bg-red-700",
          "active:bg-red-800",
          "shadow-sm shadow-red-900/20",
          "focus-visible:border-red-400 focus-visible:ring-red-300/50",
          "dark:bg-red-500 dark:hover:bg-red-600",
        ].join(" "),

        // ── Info ─────────────────────────────────────────────────────
        info: [
          "bg-sky-500 text-white border-transparent",
          "hover:bg-sky-600",
          "active:bg-sky-700",
          "shadow-sm shadow-sky-900/20",
          "focus-visible:border-sky-400 focus-visible:ring-sky-300/50",
          "dark:bg-sky-500 dark:hover:bg-sky-400",
        ].join(" "),

        // ── Info outline ─────────────────────────────────────────────
        "info-outline": [
          "border-sky-200 bg-white text-sky-700",
          "hover:bg-sky-50 hover:border-sky-300",
          "focus-visible:border-sky-400 focus-visible:ring-sky-300/50",
          "dark:border-sky-700 dark:bg-transparent dark:text-sky-400",
          "dark:hover:bg-sky-900/30",
        ].join(" "),

        // ── Link ─────────────────────────────────────────────────────
        link: [
          "text-[#1D4ED8] underline-offset-4",
          "hover:underline hover:text-[#1E40AF]",
        ].join(" "),
      },

      size: {
        default:   "h-9 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs:        "h-6 gap-1 rounded-md px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm:        "h-7 gap-1 rounded-md px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg:        "h-11 gap-2 px-5 text-[0.9rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon:      "size-9",
        "icon-xs": "size-6 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-md in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }