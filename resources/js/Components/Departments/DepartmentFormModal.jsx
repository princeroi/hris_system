import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMPTY = { department_name: "" };

export default function DepartmentFormModal({ open, onClose, department }) {
    const isEditing = !!department;
    const { data, setData, post, put, processing, errors, reset } = useForm(EMPTY);

    useEffect(() => {
        if (department) {
            setData({ department_name: department.department_name ?? "" });
        } else {
            reset();
        }
    }, [department, open]);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            put(route("departments.update", department.id), {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post(route("departments.store"), {
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
                        {isEditing ? "Edit Department" : "New Department"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="department_name">Department Name</Label>
                        <Input
                            id="department_name"
                            value={data.department_name}
                            onChange={(e) => setData("department_name", e.target.value)}
                            placeholder="e.g. Human Resources"
                            autoFocus
                        />
                        {errors.department_name && (
                            <p className="text-xs text-red-500">{errors.department_name}</p>
                        )}
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
                                : isEditing ? "Save Changes" : "Create Department"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}