// EmployeeTable.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import EmployeeRow from "./EmployeeRow";

export default function EmployeeTable({ employees, onShow, onDelete, onChangeStatus, onRehire }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-200 bg-slate-50/60">
          <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Employee No
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Employee
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Company / Branch
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Department
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Contact
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Hired Date
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </TableHead>
          <TableHead className="pr-5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {employees.length > 0 ? (
          employees.map((emp) => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              onShow={onShow}
              onDelete={onDelete}
              onChangeStatus={onChangeStatus}
              onRehire={onRehire}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="py-16 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Users className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-medium text-slate-600">No employees found</p>
                <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}