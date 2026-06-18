// Employees/Archive/Index.jsx
import { useState } from "react";
import { router, Link, Head } from "@inertiajs/react";
import { Archive, UserX, Ban, LogOut, Clock, FileX2 } from "lucide-react";
import EmployeeTable from "@/Components/Employees/EmployeeTable";
import StatCard from "@/Components/Employees/StatCard";
import { searchEmployees } from "@/utils/employeeUtils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/UI/Pagination";
import SearchInput from "@/Components/UI/SearchInput";
import RehireModal from "@/Components/Employees/RehireModal";

const ITEMS_PER_PAGE = 10;

const ARCHIVE_STATUS_CONFIG = {
  inactive:     { label: "Inactive",       icon: UserX,  iconBg: "bg-slate-100", iconColor: "text-slate-500" },
  terminated:   { label: "Terminated",     icon: Ban,    iconBg: "bg-red-50",    iconColor: "text-red-500"   },
  resigned:     { label: "Resigned",       icon: LogOut, iconBg: "bg-amber-50",  iconColor: "text-amber-500" },
  retired:      { label: "Retired",        icon: Clock,  iconBg: "bg-indigo-50", iconColor: "text-indigo-500"},
  contract_end: { label: "Contract Ended", icon: FileX2, iconBg: "bg-sky-50",    iconColor: "text-sky-500"   },
};

const ARCHIVE_STATUS_ORDER = ["inactive", "terminated", "resigned", "retired", "contract_end"];

export default function Index({ employees, stats }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rehireEmployee, setRehireEmployee] = useState(null);

  const filtered = searchEmployees(employees, search);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSearch = (value) => { setSearch(value); setCurrentPage(1); };

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      router.delete(`/employees/${id}`);
    }
  };

  const handleShow = (id) => router.visit(`/employees/${id}`);

  const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-slate-800">
          Archived Employees
        </h2>
      }
    >
      <Head title="Archived Employees" />

      <div className="py-8">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Page heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                <Archive className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Archived Employees
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  Employees who are no longer active
                </p>
              </div>
            </div>
            <Link
              href="/employees"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              Back to active employees
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {ARCHIVE_STATUS_ORDER.map((key) => {
              const config = ARCHIVE_STATUS_CONFIG[key];
              return (
                <StatCard
                  key={key}
                  icon={config.icon}
                  label={config.label}
                  value={stats[key] ?? 0}
                  iconBg={config.iconBg}
                  iconColor={config.iconColor}
                />
              );
            })}
          </div>

          {/* Archived employees table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="w-full sm:max-w-sm">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by name or employee number…"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <EmployeeTable
                employees={paginated}
                onShow={handleShow}
                onDelete={handleDelete}
                onRehire={(employee) => setRehireEmployee(employee)}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {filtered.length === 0 ? "No results" : (
                  <>Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{" "}
                  <span className="font-medium text-slate-700">{filtered.length}</span></>
                )}
              </p>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>

        </div>
      </div>

      {rehireEmployee && (
        <RehireModal
          employee={rehireEmployee}
          onClose={() => setRehireEmployee(null)}
        />
      )}
    </AuthenticatedLayout>
  );
}