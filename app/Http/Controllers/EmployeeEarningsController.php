<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeEarningsController extends Controller
{
    public function __construct(protected EmployeeService $service) {}

    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_earnings'                  => ['nullable', 'array'],
            'employee_earnings.*.earning_id'     => ['required', 'integer', 'exists:earnings,id', 'distinct'],
            'employee_earnings.*.amount'         => ['required', 'numeric', 'min:0'],
            'employee_earnings.*.frequency'      => ['nullable', 'string', 'in:one-time,daily,weekly,bi-weekly,semi-monthly,monthly'],
            'employee_earnings.*.is_continuous'  => ['boolean'],
            'employee_earnings.*.effective_date' => ['required', 'date'],
            'employee_earnings.*.end_date'       => ['nullable', 'date', 'after_or_equal:employee_earnings.*.effective_date'],
        ]);

        $this->service->manageEarnings($employee, $validated);

        return back()->with('success', 'Earnings updated successfully.');
    }
}