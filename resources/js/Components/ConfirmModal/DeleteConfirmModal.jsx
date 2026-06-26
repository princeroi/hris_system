// resources/js/Components/ConfirmModal/DeleteConfirmModal.jsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

export default function DeleteConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    description = "This action cannot be undone.",
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                            <TriangleAlert className="h-5 w-5 text-red-500" strokeWidth={1.75} />
                        </div>
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="mt-2 text-sm text-slate-500">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-2">
                    <Button type="button" variant="info-outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" variant="danger" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}