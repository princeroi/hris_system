import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const EMPTY = {
    name: "",
    default_amount: "",
    code: "",
    description: "",
    is_active: true,
};

export default function EarningFormModal({ open, onClose, earning }) {
    const isEditing = !!earning;
    const { data, setData, post, put, processing, errors, reset } = useForm(EMPTY);

    useEffect(() => {
        if (earning) {
            setData({
                name: earning.name ?? "",
                default_amount: earning.default_amount ?? "",
                code: earning.code ?? "",
                description: earning.description ?? "",
                is_active: earning.is_active ?? true,
            });
        } else {
            reset();
        }
    }, [earning, open]);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            put(route("earnings.update", earning.id), {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post(route("earnings.store"), {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    }

    function handleClose() {
        reset();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Earning" : "New Earning"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="earning_name">Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="earning_name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="e.g. Basic Pay"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Default Amount */}
                    <div className="space-y-1.5">
                        <Label htmlFor="earning_amount">Default Amount <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                                ₱
                            </span>
                            <Input
                                id="earning_amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.default_amount}
                                onChange={(e) => setData("default_amount", e.target.value)}
                                placeholder="0.00"
                                className="pl-7"
                            />
                        </div>
                        {errors.default_amount && (
                            <p className="text-xs text-red-500">{errors.default_amount}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="earning_desc">
                            Description
                            <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                        </Label>
                        <Textarea
                            id="earning_desc"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            placeholder="Brief description…"
                            rows={2}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-3">
                        <Switch
                            id="earning_active"
                            checked={data.is_active}
                            onCheckedChange={(val) => setData("is_active", val)}
                        />
                        <Label htmlFor="earning_active" className="cursor-pointer">
                            Active
                        </Label>
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                        >
                            {processing
                                ? isEditing ? "Saving…" : "Creating…"
                                : isEditing ? "Save Changes" : "Create Earning"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}