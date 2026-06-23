<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeReassignmentController extends Controller
{
    public function __construct(protected EmployeeService $service) {}

    public function store(Request $request, Employee $employee)
    {
        $newType       = $request->input('employment_type');
        $isRegularLike = in_array($newType, ['regular', 'probationary'], true);
        $isProbationary = $newType === 'probationary';

        $data = $request->validate([
            // ── Placement ──────────────────────────────────────────────────────
            'company_id'    => ['nullable', 'exists:companies,id'],
            'branch_id'     => ['nullable', 'exists:company_branches,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'position_id'   => ['nullable', 'exists:positions,id'],

            // ── Employment type (migration enum) ───────────────────────────────
            'employment_type' => [
                'nullable',
                'string',
                'in:probationary,regular,project_based,contractual,reliever,part_time,intern',
            ],

            // ── Contract status (migration enum — shared for all types) ─────────
            'contract_status' => [
                'nullable',
                'string',
                'in:no_contract,valid,expired',
            ],

            // ── Regular / Probationary only ────────────────────────────────────
            'regularization_date' => [
                $isRegularLike ? 'nullable' : 'prohibited',
                'date',
            ],
            'probationary_period_months' => [
                $isProbationary ? 'nullable' : 'prohibited',
                'integer',
                'min:1',
                'max:24',
            ],
            'probationary_evaluation_date' => [
                $isProbationary ? 'nullable' : 'prohibited',
                'date',
            ],

            // ── Non-regular / non-probationary only ───────────────────────────
            'contract_date_from' => [
                !$isRegularLike ? 'nullable' : 'prohibited',
                'date',
            ],
            'contract_date_to' => [
                !$isRegularLike ? 'nullable' : 'prohibited',
                'date',
                'after_or_equal:contract_date_from',
            ],

            // ── Reassignment meta ──────────────────────────────────────────────
            'effective_date' => ['required', 'date'],
            'reason'         => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->service->reassign($employee, $data);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['reassign' => $e->getMessage()]);
        }

        return back()->with('success', 'Employee reassigned successfully.');
    }
}