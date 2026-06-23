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
use App\Models\EmploymentDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\EmployeeStatusLog;
use App\Models\EmployeeOptionGroup;

class EmployeeController extends Controller
{
    protected EmployeeService $service;

    public function __construct(EmployeeService $service)
    {
        $this->service = $service;
    }

    private function cellOptions(): array
    {
        return \DB::table('option_groups')
            ->join('options', 'option_groups.id', '=', 'options.group_id')
            ->select('option_groups.group', 'options.value')
            ->get()
            ->groupBy('group')
            ->map(fn($items) => $items->pluck('value')->toArray())
            ->toArray();
    }

    public function index()
    {
        $employees = $this->service->active()->sortBy('employee_number')->values();

        $employees = $employees->map(function ($employee) {
            $employee = $employee->toArray();

            $ed = $employee['employment_details'] ?? null;

            if ($ed) {
                $employee['employment_details'] = array_merge($ed, [
                    'department_name' => $ed['department']['department_name'] ?? null,
                    'position_name'   => $ed['position']['position_name'] ?? null,
                    'company_name'    => $ed['company']['company_name'] ?? null,
                    'branch_name'     => $ed['branch']['branch_name'] ?? null,

                    'company_id'      => $ed['company_id'] ?? null,
                    'branch_id'       => $ed['branch_id'] ?? null,
                    'department_id'   => $ed['department_id'] ?? null,
                    'position_id'     => $ed['position_id'] ?? null,
                ]);
            }

            return $employee;
        });

        $statusCounts = EmploymentDetails::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $statuses = [
            'active',
            'inactive',
            'on_leave',
            'terminated',
            'resigned',
            'retired',
            'contract_end',
        ];

        $stats = ['total' => Employee::count()];

        foreach ($statuses as $status) {
            $stats[$status] = $statusCounts[$status] ?? 0;
        }

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'stats' => $stats,
            'companies'   => Company::all(['id', 'company_name']),
            'branches'    => CompanyBranch::all(['id', 'branch_name']),
            'departments' => Department::all(['id', 'department_name']),
            'positions'   => Position::all(['id', 'position_name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Employees/Create', [
            'companies'       => Company::select('id', 'company_name')->get(),
            'branches'        => CompanyBranch::select('id', 'branch_name', 'company_id')->get(),
            'departments'     => Department::select('id', 'department_name')->get(),
            'positions'       => Position::select('id', 'position_name')->get(),
            'workTimeFactors' => WorkTimeFactor::select('id', 'factor_name', 'working_days_per_month', 'working_hours_per_day')->get(),
            'cellOptions' => $this->cellOptions(),
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

        $data['statusLogs'] = EmployeeStatusLog::with('changedBy')
            ->where('employee_id', $employee->id)
            ->latest('applied_at')
            ->get()
            ->map(fn($log) => [
                'id'                => $log->id,
                'type'              => $log->type,
                'previous_status'   => $log->previous_status,
                'new_status'        => $log->new_status,
                'effective_date'    => $log->effective_date?->toDateString(),
                'last_working_date' => $log->last_working_date?->toDateString(),
                'reason'            => $log->reason,
                'changed_by'        => $log->changedBy?->name,
                'applied_at'        => $log->applied_at?->toDateTimeString(),
            ]);

        return Inertia::render('Employees/Show', $data);
    }

    public function edit(Employee $employee)
    {
        $data = $this->service->find($employee->id);

        return Inertia::render('Employees/Edit', array_merge($data, [
            'companies'       => Company::select('id', 'company_name')->get(),
            'branches'        => CompanyBranch::select('id', 'branch_name', 'company_id')->get(),
            'departments'     => Department::select('id', 'department_name')->get(),
            'positions'       => Position::select('id', 'position_name')->get(),
            'workTimeFactors' => WorkTimeFactor::select('id', 'factor_name', 'working_days_per_month', 'working_hours_per_day')->get(),
            'cellOptions' => $this->cellOptions(),
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
            'companies'               => Company::select('id', 'company_name')->get(),
            'branches'                => CompanyBranch::select('id', 'branch_name', 'company_id')->get(),
            'departments'             => Department::select('id', 'department_name')->get(),
            'positions'               => Position::select('id', 'position_name')->get(),
            'existingEmployeeNumbers' => Employee::pluck('employee_number'),
            'workTimeFactors'         => WorkTimeFactor::select('id', 'factor_name', 'working_days_per_month', 'working_hours_per_day')->get(),
            'cellOptions' => $this->cellOptions(),
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'employees'   => ['required', 'array', 'min:1', 'max:500'],
            'employees.*' => ['array'],
            'employees.*.employee_number' => ['required', 'string', 'max:50', 'distinct'],
            'employees.*.first_name'      => ['required', 'string', 'max:255'],
            'employees.*.last_name'       => ['required', 'string', 'max:255'],
        ]);

        $imported = 0;
        $errors   = [];

        foreach ($request->input('employees') as $i => $row) {
            try {
                DB::transaction(function () use ($row) {
                    $this->service->create($row);
                });
                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Row " . ($i + 1) . ": " . $e->getMessage();
            }
        }

        if (!empty($errors)) {
            return back()->withErrors(['bulk' => $errors]);
        }

        return redirect()
            ->route('employees.index')
            ->with('success', "{$imported} employees imported successfully.");
    }
}