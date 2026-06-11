<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Inertia\Inertia;
use App\Services\EmployeeService;
use App\Http\Requests\EmployeeRequest;
use App\Models\Company;
use App\Models\CompanyBranch;
use App\Models\Department;
use App\Models\Position;
use App\Models\WorkTimeFactor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    protected EmployeeService $service;

    public function __construct(EmployeeService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return Inertia::render('Employees/Index', [
            'employees' => $this->service->all()->sortBy('employee_number')->values(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Employees/Create', [
            'companies'   => Company::all(['id', 'company_name']),
            'branches'    => CompanyBranch::all(['id', 'branch_name']),
            'departments' => Department::all(['id', 'department_name']),
            'positions'   => Position::all(['id', 'position_name']),
            'workTimeFactors' => WorkTimeFactor::all([
                'id',
                'factor_name',
                'working_days_per_month',
                'working_hours_per_day',
            ]),
        ]);
    }

    public function store(EmployeeRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('employees.index')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee)
    {
        $data = $this->service->find($employee->id);

        $ed = $data['employmentDetails'];

        if ($ed) {
            $data['employmentDetails'] = array_merge($ed->toArray(), [
                'company_name'    => $ed->company?->company_name,
                'branch_name'     => $ed->branch?->branch_name,
                'department_name' => $ed->department?->department_name,
                'position_name'   => $ed->position?->position_name,
            ]);
        }

        return Inertia::render('Employees/Show', $data);
    }

    public function edit(Employee $employee)
    {
        $data = $this->service->find($employee->id);

        return Inertia::render('Employees/Edit', array_merge($data, [
            'companies'   => Company::all(['id', 'company_name']),
            'branches'    => CompanyBranch::all(['id', 'branch_name']),
            'departments' => Department::all(['id', 'department_name']),
            'positions'   => Position::all(['id', 'position_name']),
            'workTimeFactors' => WorkTimeFactor::all([
                'id',
                'factor_name',
                'working_days_per_month',
                'working_hours_per_day',
            ]),
        ]));
    }

    public function update(EmployeeRequest $request, Employee $employee)
    {
        $this->service->update($employee, $request->validated());

        return redirect()
            ->route('employees.show', $employee)
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $this->service->delete($employee);

        return redirect()
            ->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }

    public function bulkUpload()
    {
        return Inertia::render('Employees/BulkUpload', [
            'companies'   => Company::all(['id', 'company_name']),
            'branches'    => CompanyBranch::all(['id', 'branch_name']),
            'departments' => Department::all(['id', 'department_name']),
            'positions'   => Position::all(['id', 'position_name']),
            'existingEmployeeNumbers' => Employee::pluck('employee_number'),
            'workTimeFactors' => WorkTimeFactor::all([
                'id',
                'factor_name',
                'working_days_per_month',
                'working_hours_per_day',
            ]),
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'employees'   => ['required', 'array', 'min:1', 'max:500'],
            'employees.*' => ['array'],
            // required fields on each row
            'employees.*.employee_number' => ['required', 'string', 'max:50', 'distinct'],
            'employees.*.first_name'      => ['required', 'string', 'max:255'],
            'employees.*.last_name'       => ['required', 'string', 'max:255'],
        ]);

        $imported = 0;
        $errors   = [];

        DB::transaction(function () use ($request, &$imported, &$errors) {
            foreach ($request->input('employees') as $i => $row) {
                try {
                    $this->service->create($row);
                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Row " . ($i + 2) . ": " . $e->getMessage();
                }
            }

            if (!empty($errors)) {
                throw new \Exception("Bulk import aborted due to errors.");
            }
        });

        if (!empty($errors)) {
            return back()->withErrors(['bulk' => $errors]);
        }

        return redirect()
            ->route('employees.index')
            ->with('success', "{$imported} employees imported successfully.");
    }
}