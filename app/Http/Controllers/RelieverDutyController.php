<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Company;
use App\Models\CompanyBranch;
use App\Models\Department;
use App\Models\Position;
use App\Models\RelieverDuty;
use App\Services\RelieverDutyService;
use App\Http\Requests\RelieverDutyRequest;
use Inertia\Inertia;

class RelieverDutyController extends Controller
{
    public function __construct(protected RelieverDutyService $service) {}

    private function dropdowns(): array
    {
        $employees = Employee::with('employmentDetails')
            ->select('id', 'first_name', 'last_name', 'employee_number')
            ->orderBy('last_name')
            ->get();

        $currentDutyId = request()->route('relieverDuty')?->id;

        $scheduledDates = RelieverDuty::query()
            ->when($currentDutyId, fn ($q) => $q->where('id', '!=', $currentDutyId))
            ->get(['reliever_employee_id', 'dates', 'company_id', 'branch_id', 'department_id', 'position_id'])
            ->groupBy('reliever_employee_id')
            ->map(function ($duties) {
                return $duties->flatMap(function ($duty) {
                    return collect($duty->dates ?? [])->map(fn ($date) => [
                        'date'          => $date,
                        'company_id'    => $duty->company_id,
                        'branch_id'     => $duty->branch_id,
                        'department_id' => $duty->department_id,
                        'position_id'   => $duty->position_id,
                    ]);
                })->values();
            });

        return [
            'employees' => $employees->map(fn ($e) => [
                'id'              => $e->id,
                'name'            => "{$e->last_name}, {$e->first_name}",
                'label'           => "[{$e->employee_number}] {$e->last_name}, {$e->first_name}",
                'employment_type' => $e->employmentDetails?->employment_type,
                'company_id'      => $e->employmentDetails?->company_id,
                'branch_id'       => $e->employmentDetails?->branch_id,
                'department_id'   => $e->employmentDetails?->department_id,
                'position_id'     => $e->employmentDetails?->position_id,
            ]),

            'scheduledDates' => $scheduledDates,  

            'companies'   => Company::select('id', 'company_name')->get(),
            'branches'    => CompanyBranch::select('id', 'branch_name', 'company_id')->get(),
            'departments' => Department::select('id', 'department_name')->get(),
            'positions'   => Position::select('id', 'position_name')->get(),
        ];
    }

    public function index()
    {
        $duties = $this->service->all()->map(fn ($d) => $this->transform($d));

        $stats = [
            'total'     => $duties->count(),
            'scheduled' => $duties->where('status', 'scheduled')->count(),
            'ongoing'   => $duties->where('status', 'ongoing')->count(),
            'completed' => $duties->where('status', 'completed')->count(),
        ];

        return Inertia::render('RelieverDuties/Index', [
            'duties' => $duties,
            'stats'  => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('RelieverDuties/Create', $this->dropdowns());
    }

    public function store(RelieverDutyRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('reliever-duties.index')
            ->with('success', 'Reliever duty created successfully.');
    }

    public function show(RelieverDuty $relieverDuty)
    {
        return Inertia::render('RelieverDuties/Show', [
            'duty' => $this->transform($relieverDuty->load([
                'reliever', 'coveredEmployee', 'company',
                'branch', 'department', 'position',
            ])),
        ]);
    }

    public function edit(RelieverDuty $relieverDuty)
    {
        return Inertia::render('RelieverDuties/Edit', array_merge(
            ['duty' => $this->transform($relieverDuty->load([
                'reliever', 'coveredEmployee', 'company',
                'branch', 'department', 'position',
            ]))],
            $this->dropdowns()
        ));
    }

    public function update(RelieverDutyRequest $request, RelieverDuty $relieverDuty)
    {
        $this->service->update($relieverDuty, $request->validated());

        return redirect()
            ->route('reliever-duties.show', $relieverDuty)
            ->with('success', 'Reliever duty updated successfully.');
    }

    public function destroy(RelieverDuty $relieverDuty)
    {
        $this->service->delete($relieverDuty);

        return redirect()
            ->route('reliever-duties.index')
            ->with('success', 'Reliever duty deleted successfully.');
    }

    private function transform(RelieverDuty $d): array
    {
        $dates = $d->dates ?? [];
        sort($dates);

        return [
            'id'                   => $d->id,
            'duty_type'            => $d->duty_type,
            'duty_type_label'      => $d->duty_type_label,
            'status'               => $d->status,
            'dates'                => $dates,
            'start_date'           => $d->start_date,   // derived from dates min
            'end_date'             => $d->end_date,     // derived from dates max
            'remarks'              => $d->remarks,

            'reliever_employee_id' => $d->reliever_employee_id,
            'reliever_name'        => $d->reliever
                                        ? "{$d->reliever->last_name}, {$d->reliever->first_name}"
                                        : null,
            'reliever_number'      => $d->reliever?->employee_number,

            'covered_employee_id'  => $d->covered_employee_id,
            'covered_name'         => $d->coveredEmployee
                                        ? "{$d->coveredEmployee->last_name}, {$d->coveredEmployee->first_name}"
                                        : null,

            'company_id'           => $d->company_id,
            'company_name'         => $d->company?->company_name,
            'branch_id'            => $d->branch_id,
            'branch_name'          => $d->branch?->branch_name,
            'department_id'        => $d->department_id,
            'department_name'      => $d->department?->department_name,
            'position_id'          => $d->position_id,
            'position_name'        => $d->position?->position_name,

            'created_at'           => $d->created_at?->toDateTimeString(),
        ];
    }
}