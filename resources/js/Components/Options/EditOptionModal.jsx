// resources/js/Components/EmployeeOptions/EditOptionModal.jsx
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

export default function EditOptionModal({ open, onClose, option }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        value: option?.value ?? "",
    });

    useEffect(() => {
        if (option) {
            setData("value", option.value);
        }
    }, [option]);

    function handleSubmit(e) {
        e.preventDefault();
        put(route("employee-options.options.update", option.id), {
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
                    <DialogTitle>Edit Option Value</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-option-value">Value</Label>
                        <Input
                            id="edit-option-value"
                            value={data.value}
                            onChange={(e) => setData("value", e.target.value)}
                            autoFocus
                        />
                        {errors.value && (
                            <p className="text-xs text-red-500">{errors.value}</p>
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