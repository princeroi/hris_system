import { useState, useMemo } from "react";
import { router, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import RelieverDutyTable from "@/Components/RelieverDuties/RelieverDutyTable";
import StatCard from "@/Components/Employees/StatCard";
import SearchInput from "@/Components/UI/SearchInput";
import Pagination from "@/Components/UI/Pagination";
import DeleteConfirmModal from "@/Components/ConfirmModal/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { FileText, Plus, CalendarClock, Activity, CheckCircle2, LayoutList } from "lucide-react";

const STAT_CONFIG = [
    { key: "total",     label: "Total",     icon: LayoutList,   iconBg: "bg-[#3B5BA5]/10", iconColor: "text-[#3B5BA5]"   },
    { key: "scheduled", label: "Scheduled", icon: CalendarClock,iconBg: "bg-blue-50",       iconColor: "text-blue-500"    },
    { key: "ongoing",   label: "Ongoing",   icon: Activity,     iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
    { key: "completed", label: "Completed", icon: CheckCircle2, iconBg: "bg-slate-100",     iconColor: "text-slate-400"   },
];

const ITEMS_PER_PAGE = 15;

export default function Index({ duties, stats }) {
    const [search,       setSearch]       = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter,   setTypeFilter]   = useState("all");
    const [currentPage,  setCurrentPage]  = useState(1);
    const [deleteId,     setDeleteId]     = useState(null);

    const filtered = useMemo(() => {
        let list = duties ?? [];
        if (statusFilter !== "all") list = list.filter(d => d.status    === statusFilter);
        if (typeFilter   !== "all") list = list.filter(d => d.duty_type === typeFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(d =>
                d.reliever_name?.toLowerCase().includes(q)   ||
                d.covered_name?.toLowerCase().includes(q)    ||
                d.company_name?.toLowerCase().includes(q)    ||
                d.branch_name?.toLowerCase().includes(q)     ||
                d.department_name?.toLowerCase().includes(q) ||
                String(d.id).includes(q)
            );
        }
        return list;
    }, [duties, search, statusFilter, typeFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated  = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    function handleSearch(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    function handleDeleteConfirm() {
        if (!deleteId) return;
        router.delete(route("reliever-duties.destroy", deleteId), {
            onFinish: () => setDeleteId(null),
        });
    }

    const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem   = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

    const selectCls = "min-w-[130px] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/40";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Reliever Duties
                </h2>
            }
        >
            <Head title="Reliever Duties" />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">

                    {/* Page heading */}
                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <FileText className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    Reliever Duties
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Track and manage all reliever assignments
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {STAT_CONFIG.map(({ key, label, icon, iconBg, iconColor }) => (
                            <StatCard
                                key={key}
                                icon={icon}
                                label={label}
                                value={stats?.[key] ?? 0}
                                iconBg={iconBg}
                                iconColor={iconColor}
                            />
                        ))}
                    </div>

                    {/* Main card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* Toolbar */}
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:max-w-sm">
                                <SearchInput
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Search by name, company, branch…"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                                <select
                                    value={statusFilter}
                                    onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    className={selectCls}
                                >
                                    <option value="all">All statuses</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <select
                                    value={typeFilter}
                                    onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                                    className="min-w-[110px] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/40"
                                >
                                    <option value="all">All types</option>
                                    <option value="vacant_post">Vacant Post</option>
                                    <option value="cover_up">Cover-Up</option>
                                </select>
                                <Button
                                    onClick={() => router.visit(route("reliever-duties.create"))}
                                    variant="info"
                                >
                                    <Plus className="h-4 w-4" strokeWidth={1.75} />
                                    New Duty
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <RelieverDutyTable
                                duties={paginated}
                                onDelete={setDeleteId}
                            />
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
                title="Delete Reliever Duty"
                description="This will permanently delete the reliever duty. This action cannot be undone."
            />

        </AuthenticatedLayout>
    );
}