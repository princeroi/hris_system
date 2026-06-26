import { useState, useMemo } from "react";
import { router, Head } from "@inertiajs/react";
import { Users, Plus } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/UI/Pagination";
import SearchInput from "@/Components/UI/SearchInput";
import DeleteConfirmModal from "@/Components/ConfirmModal/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import UserTable from "@/Components/Users/UserTable";

const ITEMS_PER_PAGE = 15;

export default function Index({ users }) {
    const [search,      setSearch]      = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId,    setDeleteId]    = useState(null);

    const filtered = useMemo(() => {
        const list = users?.data ?? [];
        if (!search.trim()) return list;
        const q = search.toLowerCase();
        return list.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.roles?.some(r => r.toLowerCase().includes(q))
        );
    }, [users, search]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated  = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem   = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

    function handleSearch(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    function handleDeleteConfirm() {
        if (!deleteId) return;
        router.delete(route("users.destroy", deleteId), {
            onFinish: () => setDeleteId(null),
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">

                    {/* Page heading */}
                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <Users className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    Users
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Manage and view all system users
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* Toolbar */}
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:max-w-sm">
                                <SearchInput
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Search by name, email or role…"
                                />
                            </div>
                            <Button
                                onClick={() => router.visit(route("users.create"))}
                                variant="info"
                            >
                                <Plus className="h-4 w-4" strokeWidth={1.75} />
                                Add User
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <UserTable users={paginated} onDelete={setDeleteId} />
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                {filtered.length === 0 ? "No results" : (
                                    <>
                                        Showing{" "}
                                        <span className="font-medium text-slate-700">{startItem}–{endItem}</span>
                                        {" "}of{" "}
                                        <span className="font-medium text-slate-700">{filtered.length}</span>
                                    </>
                                )}
                            </p>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                description="This will permanently delete the user. This action cannot be undone."
            />
        </AuthenticatedLayout>
    );
}