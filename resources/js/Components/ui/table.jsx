import * as React from "react"
import { cn } from "@/lib/utils"

/*
  Blue-branded table component — matches the AuthenticatedLayout design system.
  - Inter font, consistent with sidebar
  - Blue accent on hover rows and selected state
  - Crisp header with uppercase tracked labels (navy tint)
  - Hairline dividers using blue-tinted gray
  - Zebra-free: clean rows with subtle hover only
*/

function Table({ className, ...props }) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border", "border-[#DBEAFE] bg-white shadow-sm shadow-blue-50/60")} >
      <table
        className={cn("w-full text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn(
        "border-b border-[#DBEAFE]",
        // subtle blue-tinted header bg
        "bg-[#F0F6FF]",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn(
        // hairline blue-tinted row dividers
        "[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-[#EFF6FF]",
        className
      )}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn(
        "border-t border-[#DBEAFE] bg-[#F0F6FF] font-medium",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-100",
        // blue-tinted hover — matches sidebar brand
        "hover:bg-[#EFF6FF]",
        "data-[state=selected]:bg-[#DBEAFE]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        // refined header: navy-blue tint, tight tracking, proper weight
        "h-10 px-5 text-left align-middle",
        "text-[10.5px] font-semibold uppercase tracking-[0.1em]",
        "text-[#3B5BA5] whitespace-nowrap select-none",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }) {
  return (
    <td
      className={cn(
        "px-5 py-3.5 align-middle",
        // slightly cooler gray to harmonise with blue chrome
        "text-[13px] text-[#374151] whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      className={cn(
        "mt-3 text-[11px] text-[#93C5FD]/80 tracking-wide",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}