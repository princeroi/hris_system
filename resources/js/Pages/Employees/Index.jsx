import { useState } from "react";
import { router } from "@inertiajs/react";
import EmployeeTable from "@/Components/Employees/EmployeeTable";
import { searchEmployees } from "@/utils/employeeUtils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Head } from '@inertiajs/react';
import Pagination from "@/Components/UI/Pagination";
import SearchInput from "@/Components/UI/SearchInput";

const ITEMS_PER_PAGE = 10;

export default function Index({ employees }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    if (confirm("Delete employee?")) {
      router.delete(`/employees/${id}`);
    }
  };

  const handleShow = (id) => {
    router.visit(`/employees/${id}`);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Employees List
        </h2>
      }
    >
      <Head title="Employees" />

      <div className="py-5">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 space-y-4">

              <div className="flex justify-between items-center mb-4">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search employee..."
                />
                <Button
                    size="sm"
                    variant="info-outline"
                    onClick={() => router.visit("/employees/bulk-upload")}
                    className="text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                    ↑ Bulk Upload
                </Button>
                <Link href="/employees/create">
                  <Button variant="info">+ Add Employee</Button>
                </Link>
              </div>

              <EmployeeTable
                employees={paginated}
                onShow={handleShow}
                onDelete={handleDelete}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}