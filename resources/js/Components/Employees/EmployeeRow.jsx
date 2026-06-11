import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getFullName } from "@/utils/employeeUtils";

export default function EmployeeRow({ employee, onShow, onDelete }) {
  return (
    <TableRow>
      <TableCell>{employee.employee_number}</TableCell>
      <TableCell>{getFullName(employee)}</TableCell>

      <TableCell className="text-right space-x-2">
        <Button
          variant="success"
          size="sm"
          onClick={() => onShow(employee.id)}
        >
          View
        </Button>

        <Button
          variant="info"
          size="sm"
          onClick={() => (window.location.href = `/employees/${employee.id}/edit`)}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(employee.id)}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}