import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Coins, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/Components/UI/SearchInput";
import EarningTable from "@/Components/Earnings/EarningTable";
import EarningFormModal from "@/Components/Earnings/EarningFormModal";

export default function Index({ earnings }) {
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);

    const filtered = search.trim()
        ? earnings.filter(
              (e) =>
                  e.name.toLowerCase().includes(search.toLowerCase()) ||
                  (e.code ?? "").toLowerCase().includes(search.toLowerCase())
          )
        : earnings;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Earnings
                </h2>
            }
        >
            <Head title="Earnings" />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <Coins className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    Earnings
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Manage earning types and default amounts
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} />
                            New Earning
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:max-w-sm">
                                <SearchInput
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search by name or code…"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <EarningTable earnings={filtered} />
                        </div>
                    </div>
                </div>
            </div>

            <EarningFormModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                earning={null}
            />
        </AuthenticatedLayout>
    );
}