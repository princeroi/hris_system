// resources/js/Components/EmployeeOptions/EditGroupModal.jsx
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
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

export default function EditGroupModal({ open, onClose, group }) {
    const { data, setData, put, processing, errors, reset, setDefaults } =
        useForm({ group: group?.group ?? "" });

    useEffect(() => {
        if (group) {
            setData("group", group.group);
        }
    }, [group]);

    function handleSubmit(e) {
        e.preventDefault();
        put(route("employee-options.groups.update", group.id), {
            onSuccess: () => {
                onClose();
            },
        });
    }

    function handleClose() {
        reset();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Option Group</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-group-key">
                            Group Key{" "}
                            <span className="text-slate-400 font-normal text-xs">
                                (snake_case)
                            </span>
                        </Label>
                        <Input
                            id="edit-group-key"
                            value={data.group}
                            onChange={(e) => setData("group", e.target.value)}
                            autoFocus
                        />
                        {errors.group && (
                            <p className="text-xs text-red-500">{errors.group}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                        >
                            {processing ? "Saving…" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}