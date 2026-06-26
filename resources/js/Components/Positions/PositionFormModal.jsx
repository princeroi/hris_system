import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMPTY = { position_name: "", position_description: "" };

export default function PositionFormModal({ open, onClose, position }) {
    const isEditing = !!position;
    const { data, setData, post, put, processing, errors, reset } = useForm(EMPTY);

    useEffect(() => {
        if (position) {
            setData({
                position_name: position.position_name ?? "",
                position_description: position.position_description ?? "",
            });
        } else {
            reset();
        }
    }, [position, open]);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            put(route("positions.update", position.id), {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post(route("positions.store"), {
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
            <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Position" : "New Position"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="position_name">Position Name</Label>
                        <Input
                            id="position_name"
                            value={data.position_name}
                            onChange={(e) => setData("position_name", e.target.value)}
                            placeholder="e.g. Software Engineer"
                            autoFocus
                        />
                        {errors.position_name && (
                            <p className="text-xs text-red-500">{errors.position_name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="position_description">
                            Description{" "}
                            <span className="text-slate-400 font-normal text-xs">(optional)</span>
                        </Label>
                        <textarea
                            id="position_description"
                            value={data.position_description}
                            onChange={(e) => setData("position_description", e.target.value)}
                            placeholder="Brief description of this position…"
                            rows={4}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/30 focus:border-[#3B5BA5] resize-none"
                        />
                        {errors.position_description && (
                            <p className="text-xs text-red-500">{errors.position_description}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="info-outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="info"
                        >
                            {processing
                                ? isEditing ? "Saving…" : "Creating…"
                                : isEditing ? "Save Changes" : "Create Position"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}