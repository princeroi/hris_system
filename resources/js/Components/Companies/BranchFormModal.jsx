// resources/js/Components/Companies/BranchFormModal.jsx
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

const EMPTY = {
    branch_name: "",
    branch_location: "",
    branch_contact_person: "",
    branch_contact_number: "",
};

export default function BranchFormModal({ open, onClose, company, branch }) {
    const isEditing = !!branch;

    const { data, setData, post, put, processing, errors, reset } = useForm(EMPTY);

    useEffect(() => {
        if (branch) {
            setData({
                branch_name: branch.branch_name ?? "",
                branch_location: branch.branch_location ?? "",
                branch_contact_person: branch.branch_contact_person ?? "",
                branch_contact_number: branch.branch_contact_number ?? "",
            });
        } else {
            reset();
        }
    }, [branch, open, setData, reset]);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            put(route("companies.branches.update", [company.id, branch.id]), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route("companies.branches.store", company.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
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
                        {isEditing ? "Edit Branch" : `Add Branch to ${company?.company_name}`}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Branch Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="branch_name">Branch Name</Label>
                        <Input
                            id="branch_name"
                            value={data.branch_name}
                            onChange={(e) => setData("branch_name", e.target.value)}
                            placeholder="e.g. Main Office"
                            autoFocus
                        />
                        {errors.branch_name && (
                            <p className="text-xs text-red-500">{errors.branch_name}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                        <Label htmlFor="branch_location">
                            Location{" "}
                            <span className="text-slate-400 font-normal text-xs">(optional)</span>
                        </Label>
                        <Input
                            id="branch_location"
                            value={data.branch_location}
                            onChange={(e) => setData("branch_location", e.target.value)}
                            placeholder="e.g. Makati City"
                        />
                        {errors.branch_location && (
                            <p className="text-xs text-red-500">{errors.branch_location}</p>
                        )}
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-1.5">
                        <Label htmlFor="branch_contact_person">
                            Contact Person{" "}
                            <span className="text-slate-400 font-normal text-xs">(optional)</span>
                        </Label>
                        <Input
                            id="branch_contact_person"
                            value={data.branch_contact_person}
                            onChange={(e) => setData("branch_contact_person", e.target.value)}
                            placeholder="e.g. Juan Dela Cruz"
                        />
                        {errors.branch_contact_person && (
                            <p className="text-xs text-red-500">{errors.branch_contact_person}</p>
                        )}
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1.5">
                        <Label htmlFor="branch_contact_number">
                            Contact Number{" "}
                            <span className="text-slate-400 font-normal text-xs">(optional)</span>
                        </Label>
                        <Input
                            id="branch_contact_number"
                            value={data.branch_contact_number}
                            onChange={(e) => setData("branch_contact_number", e.target.value)}
                            placeholder="e.g. 09171234567"
                        />
                        {errors.branch_contact_number && (
                            <p className="text-xs text-red-500">{errors.branch_contact_number}</p>
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
                                ? isEditing ? "Saving…" : "Adding…"
                                : isEditing ? "Save Changes" : "Add Branch"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}