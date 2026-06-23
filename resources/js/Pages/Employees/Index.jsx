import { useState } from "react";
import { router, Link, Head } from "@inertiajs/react";
import { Upload, Plus, Users } from "lucide-react";
import EmployeeTable from "@/Components/Employees/EmployeeTable";
import StatCard from "@/Components/Employees/StatCard";
import { STATUS_CONFIG, STATUS_ORDER } from "@/Components/Employees/statusConfig";
import { searchEmployees } from "@/utils/employeeUtils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/UI/Pagination";
import SearchInput from "@/Components/UI/SearchInput";
import ChangeStatusModal from "@/Components/Employees/ChangeStatusModal";
import ReassignModal from "@/Components/Employees/ReassignModal";

const ITEMS_PER_PAGE = 10;

export default function Index({ employees, stats, companies, branches, departments, positions }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusEmployee, setStatusEmployee] = useState(null);
  const [reassignEmployee, setReassignEmployee] = useState(null);

  const filtered = searchEmployees(employees, search);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      router.delete(`/employees/${id}`);
    }
  };

  const handleShow = (id) => {
    router.visit(`/employees/${id}`);
  };

  const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-slate-800">
          Employees
        </h2>
      }
    >
      <Head title="Employees" />

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
                  Employees
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  Manage and view all employee records
                </p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATUS_ORDER.map((key) => {
              const config = STATUS_CONFIG[key];
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

          {/* Main card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:max-w-sm">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by name or employee number…"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <button
                  onClick={() => router.visit("/employees/bulk-upload")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <Upload className="h-4 w-4" strokeWidth={1.75} />
                  Bulk upload
                </button>
                <Link
                  href="/employees/create"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3B5BA5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#33508f]"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                  Add employee
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <EmployeeTable
                employees={paginated}
                onShow={handleShow}
                onDelete={handleDelete}
                onChangeStatus={(employee) => setStatusEmployee(employee)}
                onReassign={(employee) => setReassignEmployee(employee)}
              />
            </div>

            {/* Footer / Pagination */}
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {filtered.length === 0 ? (
                  "No results"
                ) : (
                  <>
                    Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{" "}
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

      {statusEmployee && (
        <ChangeStatusModal
          employee={statusEmployee}
          onClose={() => setStatusEmployee(null)}
        />
      )}

      {reassignEmployee && (
        <ReassignModal
          employee={reassignEmployee}
          companies={companies}
          branches={branches}
          departments={departments}
          positions={positions}
          onClose={() => setReassignEmployee(null)}
        />
      )}

    </AuthenticatedLayout>
  );
}