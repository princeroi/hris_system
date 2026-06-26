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
use App\Models\Earning;
use App\Services\OptionService;

class EmployeeController extends Controller
{
    protected EmployeeService $service;

    public function __construct(EmployeeService $service)
    {
        $this->service = $service;
    }

    private function earnings():array
    {
        return \DB::table('earnings')
            ->where('is_active', true) 
            ->orderBy('name')
            ->get();
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
            'workTimeFactors' => WorkTimeFactor::select(  
                'id',
                'factor_name',
                'working_days_per_month',
                'working_hours_per_day'
            )->get(),
            'earnings' => Earning::active()->get(['id', 'name', 'default_amount']),
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
            'cellOptions' => OptionService::cellOptions(),
            'earnings' => Earning::active()->get(['id', 'name', 'default_amount']),
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

        // ── Status logs ───────────────────────────────────────────────────────────
        $data['statusLogs'] = \App\Models\EmployeeStatusLog::with('changedBy')
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
                'is_processed'      => $log->is_processed,
            ]);

        // ── Reassignment logs ─────────────────────────────────────────────────────
        $data['reassignmentLogs'] = \App\Models\EmployeeReassignmentLog::with([
                'changedBy',
                'prevCompany', 'newCompany',
                'prevBranch',  'newBranch',
                'prevDepartment', 'newDepartment',
                'prevPosition',   'newPosition',
            ])
            ->where('employee_id', $employee->id)
            ->latest('effective_date')
            ->get()
            ->map(fn($log) => [
                'id'                               => $log->id,
                'effective_date'                   => $log->effective_date?->toDateString(),
                'reason'                           => $log->reason,
                'changed_by'                       => $log->changedBy?->name,
                'is_processed'                     => $log->is_processed,
                'processed_at'                     => $log->processed_at?->toDateTimeString(),
                'created_at'                       => $log->created_at?->toDateTimeString(),

                'prev_company_name'                => $log->prevCompany?->company_name,
                'prev_branch_name'                 => $log->prevBranch?->branch_name,
                'prev_department_name'             => $log->prevDepartment?->department_name,
                'prev_position_name'               => $log->prevPosition?->position_name,
                'prev_employment_type'             => $log->prev_employment_type,
                'prev_contract_status'             => $log->prev_contract_status,
                'prev_contract_date_from'          => $log->prev_contract_date_from?->toDateString(),
                'prev_contract_date_to'            => $log->prev_contract_date_to?->toDateString(),
                'prev_regularization_date'         => $log->prev_regularization_date?->toDateString(),
                'prev_probationary_period_months'  => $log->prev_probationary_period_months,
                'prev_probationary_evaluation_date'=> $log->prev_probationary_evaluation_date?->toDateString(),

                'new_company_name'                 => $log->newCompany?->company_name,
                'new_branch_name'                  => $log->newBranch?->branch_name,
                'new_department_name'              => $log->newDepartment?->department_name,
                'new_position_name'                => $log->newPosition?->position_name,
                'new_employment_type'              => $log->new_employment_type,
                'new_contract_status'              => $log->new_contract_status,
                'new_contract_date_from'           => $log->new_contract_date_from?->toDateString(),
                'new_contract_date_to'             => $log->new_contract_date_to?->toDateString(),
                'new_regularization_date'          => $log->new_regularization_date?->toDateString(),
                'new_probationary_period_months'   => $log->new_probationary_period_months,
                'new_probationary_evaluation_date' => $log->new_probationary_evaluation_date?->toDateString(),
            ]);

        // ── Compensation logs ─────────────────────────────────────────────────────
        $data['compensationLogs'] = \App\Models\EmployeeCompensationLog::with('changedBy')
            ->where('employee_id', $employee->id)
            ->latest('effective_date')
            ->get()
            ->map(fn($log) => [
                'id'                       => $log->id,
                'effective_date'           => $log->effective_date?->toDateString(),
                'reason'                   => $log->reason,
                'changed_by'               => $log->changedBy?->name,
                'is_processed'             => $log->is_processed,
                'processed_at'             => $log->processed_at?->toDateTimeString(),
                'created_at'               => $log->created_at?->toDateTimeString(),

                'prev_monthly_rate'        => $log->prev_monthly_rate,
                'prev_daily_rate'          => $log->prev_daily_rate,
                'prev_hourly_rate'         => $log->prev_hourly_rate,
                'prev_payroll_type'        => $log->prev_payroll_type,
                'prev_salary_type'         => $log->prev_salary_type,

                'new_monthly_rate'         => $log->new_monthly_rate,
                'new_daily_rate'           => $log->new_daily_rate,
                'new_hourly_rate'          => $log->new_hourly_rate,
                'new_payroll_type'         => $log->new_payroll_type,
                'new_salary_type'          => $log->new_salary_type,
            ]);

        // ── Earning logs ──────────────────────────────────────────────────────────
        $data['earningLogs'] = \App\Models\EmployeeEarningLog::with(['earning', 'changedBy'])
            ->where('employee_id', $employee->id)
            ->latest('effective_date')
            ->get()
            ->map(fn($log) => [
                'id'             => $log->id,
                'earning_name'   => $log->earning?->name,
                'action'         => $log->action,
                'prev_amount'    => $log->prev_amount,
                'prev_frequency' => $log->prev_frequency,
                'new_amount'     => $log->new_amount,
                'new_frequency'  => $log->new_frequency,
                'effective_date' => $log->effective_date?->toDateString(),
                'changed_by'     => $log->changedBy?->name,
                'is_processed'   => $log->is_processed,
                'processed_at'   => $log->processed_at?->toDateTimeString(),
                'created_at'     => $log->created_at?->toDateTimeString(),
            ]);

        // ── Reliever duties ───────────────────────────────────────────────────────
        $data['relieverDuties'] = \App\Models\RelieverDuty::with([
                'coveredEmployee', 'company', 'branch', 'department', 'position',
            ])
            ->where('reliever_employee_id', $employee->id)
            ->latest()
            ->get()
            ->map(function ($d) {
                $dates = $d->dates ?? [];
                sort($dates);
                return [
                    'id'               => $d->id,
                    'duty_type'        => $d->duty_type,
                    'duty_type_label'  => $d->duty_type_label,
                    'status'           => $d->computeStatus(),
                    'dates'            => $dates,
                    'start_date'       => $d->start_date,
                    'end_date'         => $d->end_date,
                    'remarks'          => $d->remarks,
                    'covered_name'     => $d->coveredEmployee
                        ? "{$d->coveredEmployee->last_name}, {$d->coveredEmployee->first_name}"
                        : null,
                    'company_name'     => $d->company?->company_name,
                    'branch_name'      => $d->branch?->branch_name,
                    'department_name'  => $d->department?->department_name,
                    'position_name'    => $d->position?->position_name,
                    'created_at'       => $d->created_at?->toDateTimeString(),
                ];
            });

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
            'cellOptions' => OptionService::cellOptions(),
            'earnings' => Earning::active()->get(['id', 'name', 'default_amount']),
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
            'cellOptions' => OptionService::cellOptions(),
            'earnings' => Earning::select('id', 'name', 'default_amount')->get(),
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

    // public function changeCompensation(Request $request, Employee $employee)
    // {
    //     $validated = $request->validate([
    //         'work_time_factor_id' => ['nullable', 'integer', 'exists:work_time_factors,id'],
    //         'monthly_rate'        => ['nullable', 'numeric', 'min:0'],
    //         'daily_rate'          => ['nullable', 'numeric', 'min:0'],
    //         'hourly_rate'         => ['nullable', 'numeric', 'min:0'],
    //         'payroll_type'        => ['nullable', 'string', 'in:monthly,semi_monthly,weekly,daily,hourly'],
    //         'salary_type'         => ['nullable', 'string', 'in:hourly_rate,daily_rate,weekly_rate,semi_monthly_rate,monthly_rate'],
    //         'effective_date'      => ['required', 'date'],
    //         'reason'              => ['nullable', 'string', 'max:1000'],
    //     ]);
    
    //     $this->service->changeCompensation($employee, $validated);
    
    //     return redirect()
    //         ->back()
    //         ->with('success', 'Compensation updated successfully.');
    // }
    
    // public function manageEarnings(Request $request, Employee $employee)
    // {
    //     $validated = $request->validate([
    //         'employee_earnings'                  => ['nullable', 'array'],
    //         'employee_earnings.*.earning_id'     => ['required', 'integer', 'exists:earnings,id', 'distinct'],
    //         'employee_earnings.*.amount'         => ['required', 'numeric', 'min:0'],
    //         'employee_earnings.*.frequency'      => ['nullable', 'string', 'in:one-time,daily,weekly,bi-weekly,semi-monthly,monthly'],
    //         'employee_earnings.*.is_continuous'  => ['boolean'],
    //         'employee_earnings.*.effective_date' => ['nullable', 'date'],
    //         'employee_earnings.*.end_date'       => ['nullable', 'date', 'after_or_equal:employee_earnings.*.effective_date'],
    //     ]);
    
    //     $this->service->manageEarnings($employee, $validated);
    
    //     return redirect()
    //         ->back()
    //         ->with('success', 'Earnings updated successfully.');
    // }
}