// resources/js/Components/EmployeeOptions/AddOptionModal.jsx
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

export default function AddOptionModal({ open, onClose, group }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        value: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("employee-options.groups.options.store", group.id), {
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
                    <DialogTitle>
                        Add Option to{" "}
                        <code className="font-mono text-[#3B5BA5]">
                            {group?.group}
                        </code>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="option-value">Option Value</Label>
                        <Input
                            id="option-value"
                            value={data.value}
                            onChange={(e) => setData("value", e.target.value)}
                            placeholder="e.g. Single"
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
                            {processing ? "Adding…" : "Add Option"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}