// resources/js/Components/Employees/DynamicSelect.jsx

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

/**
 * Renders a Select driven by cellOptions[group].
 * Falls back to `fallbackOptions` if the group isn't in cellOptions.
 */
export default function DynamicSelect({
    value,
    onValueChange,
    group,
    cellOptions = {},
    fallbackOptions = [],
    placeholder = "Select",
    formatLabel = (v) => v.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
}) {
    const options = cellOptions[group]?.length
        ? cellOptions[group]
        : fallbackOptions;

    return (
        <Select value={value ?? ""} onValueChange={onValueChange}>
            <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
            <SelectContent>
                {options.map(v => (
                    <SelectItem key={v} value={v}>{formatLabel(v)}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}