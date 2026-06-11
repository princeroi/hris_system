import * as React from "react"
import { cva } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Tabs({ className, orientation = "horizontal", ...props }) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
            {...props}
        />
    );
}

const tabsListVariants = cva(
    "group/tabs-list inline-flex items-center group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
    {
        variants: {
            variant: {
                default: "w-fit rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-[3px] gap-0.5",
                line:    "w-full rounded-none border-b border-[#BFDBFE] bg-transparent gap-0 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function TabsList({ className, variant = "default", ...props }) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    );
}

function TabsTrigger({ className, ...props }) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                // Base
                "relative inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-all outline-none",
                "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
                "disabled:pointer-events-none disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",

                // Focus ring — matches input blue ring
                "focus-visible:ring-3 focus-visible:ring-blue-300/40 focus-visible:outline-none",

                // ── Default variant (pill inside container) ──────────────
                "group-data-[variant=default]/tabs-list:h-[calc(100%-2px)]",
                "group-data-[variant=default]/tabs-list:rounded-md",
                "group-data-[variant=default]/tabs-list:px-3 group-data-[variant=default]/tabs-list:py-0.5",
                "group-data-[variant=default]/tabs-list:text-[#93C5FD]",
                "group-data-[variant=default]/tabs-list:hover:text-[#3B82F6]",
                "group-data-[variant=default]/tabs-list:hover:bg-white/60",
                // Active — default
                "group-data-[variant=default]/tabs-list:data-[state=active]:bg-white",
                "group-data-[variant=default]/tabs-list:data-[state=active]:text-[#1E40AF]",
                "group-data-[variant=default]/tabs-list:data-[state=active]:border",
                "group-data-[variant=default]/tabs-list:data-[state=active]:border-[#BFDBFE]",
                "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",

                // ── Line variant (underline tab bar) ─────────────────────
                "group-data-[variant=line]/tabs-list:rounded-none",
                "group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:py-2.5",
                "group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent",
                "group-data-[variant=line]/tabs-list:text-[#93C5FD]",
                "group-data-[variant=line]/tabs-list:hover:text-[#3B82F6]",
                "group-data-[variant=line]/tabs-list:hover:border-[#BFDBFE]",
                "group-data-[variant=line]/tabs-list:mb-[-1px]",
                // Active — line
                "group-data-[variant=line]/tabs-list:data-[state=active]:border-[#3B82F6]",
                "group-data-[variant=line]/tabs-list:data-[state=active]:text-[#1E40AF]",
                "group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",

                className
            )}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn("flex-1 text-sm outline-none", className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }