// resources/js/Components/EmployeeOptions/CreateGroupModal.jsx
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

export default function CreateGroupModal({ open, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        group: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("employee-options.groups.store"), {
            onSuccess: () => {
                reset();
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
                    <DialogTitle>Create Option Group</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="group-key">
                            Group Key{" "}
                            <span className="text-slate-400 font-normal text-xs">
                                (snake_case, e.g. civil_status)
                            </span>
                        </Label>
                        <Input
                            id="group-key"
                            value={data.group}
                            onChange={(e) => setData("group", e.target.value)}
                            placeholder="e.g. civil_status"
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
                            {processing ? "Creating…" : "Create Group"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}