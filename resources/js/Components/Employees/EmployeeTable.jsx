import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmployeeRow from "./EmployeeRow";

export default function EmployeeTable({ employees, onShow, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6">
              No employees found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}