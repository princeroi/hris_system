export function getFullName(emp) {
    return [emp.first_name, emp.middle_name, emp.last_name, emp.suffix]
        .filter(Boolean)
        .join(" ");
}

export function searchEmployees(employees, keyword) {
  if (!keyword) return employees;

  return employees.filter((emp) =>
    getFullName(emp).toLowerCase().includes(keyword.toLowerCase()) ||
    emp.employee_number?.toString().toLowerCase().includes(keyword.toLowerCase()) ||
    emp.id?.toString().includes(keyword)
  );
}