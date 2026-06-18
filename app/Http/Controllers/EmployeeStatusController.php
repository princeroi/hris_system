<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeService;
use App\Http\Requests\ChangeStatusRequest;
use Illuminate\Http\Request;

class EmployeeStatusController extends Controller
{
    public function __construct(protected EmployeeService $service) {}

    public function update(ChangeStatusRequest $request, Employee $employee)
    {
        try {
            $this->service->changeStatus($employee, $request->validated());
        } catch (\RuntimeException $e) {
            return back()->withErrors(['status' => $e->getMessage()]);
        }

        return back()->with('success', 'Employee status updated successfully.');
    }

    public function rehire(Request $request, Employee $employee)
    {
        $data = $request->validate([
            'rehire_date' => ['required', 'date'],
            'reason'      => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->service->rehire($employee, $data);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['rehire' => $e->getMessage()]);
        }

        return back()->with('success', 'Employee rehired successfully.');
    }
}