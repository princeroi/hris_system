<?php

namespace App\Http\Controllers;

use App\Models\EmploymentDetails;
use App\Models\EmployeeStatusLog;
use App\Services\EmployeeService;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ArchiveEmployeeController extends Controller
{
    public function __construct(protected EmployeeService $service) {}

    public function index()
    {
        $employees = $this->service->archive()->sortBy('employee_number')->values();

        $employees = $employees->map(function ($employee) {
            $employee = $employee->toArray();
            $ed = $employee['employment_details'] ?? null;

            if ($ed) {
                $employee['employment_details'] = array_merge($ed, [
                    'department_name' => $ed['department']['department_name'] ?? null,
                    'position_name'   => $ed['position']['position_name'] ?? null,
                    'company_name'    => $ed['company']['company_name'] ?? null,
                    'branch_name'     => $ed['branch']['branch_name'] ?? null,
                ]);
            }

            return $employee;
        });

        $statusCounts = EmploymentDetails::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $archivedStatuses = ['inactive', 'terminated', 'resigned', 'retired', 'contract_end'];

        $stats = ['total' => $employees->count()];
        foreach ($archivedStatuses as $status) {
            $stats[$status] = $statusCounts[$status] ?? 0;
        }

        $logs = EmployeeStatusLog::with(['employee', 'changedBy'])
            ->latest('applied_at')
            ->get()
            ->map(fn($log) => [
                'id'                => $log->id,
                'type'              => $log->type,
                'employee_number'   => $log->employee?->employee_number,
                'employee_name'     => trim(($log->employee?->first_name ?? '') . ' ' . ($log->employee?->last_name ?? '')),
                'previous_status'   => $log->previous_status,
                'new_status'        => $log->new_status,
                'effective_date'    => $log->effective_date?->toDateString(),
                'last_working_date' => $log->last_working_date?->toDateString(),
                'reason'            => $log->reason,
                'changed_by'        => $log->changedBy?->name,
                'applied_at'        => $log->applied_at?->toDateTimeString(),
            ]);

        return Inertia::render('Employees/ArchiveEmployees/Index', [
            'employees' => $employees,
            'stats'     => $stats,
            'logs'      => $logs,
        ]);
    }
}