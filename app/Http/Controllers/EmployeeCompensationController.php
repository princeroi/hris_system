<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeCompensationController extends Controller
{
    public function __construct(protected EmployeeService $service) {}

    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'work_time_factor_id' => ['nullable', 'integer', 'exists:work_time_factors,id'],
            'monthly_rate'        => ['nullable', 'numeric', 'min:0'],
            'daily_rate'          => ['nullable', 'numeric', 'min:0'],
            'hourly_rate'         => ['nullable', 'numeric', 'min:0'],
            'payroll_type'        => ['nullable', 'string', 'in:monthly,semi_monthly,weekly,daily,hourly'],
            'salary_type'         => ['nullable', 'string', 'in:hourly_rate,daily_rate,weekly_rate,semi_monthly_rate,monthly_rate'],
            'effective_date'      => ['required', 'date'],
            'reason'              => ['nullable', 'string', 'max:1000'],
        ]);

        $this->service->changeCompensation($employee, $validated);

        return back()->with('success', 'Compensation updated successfully.');
    }
}