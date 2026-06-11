<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class EmployeeReassignmentLog extends Model
{
    protected $fillable = [
        'employee_id',
        'prev_company_id', 'prev_branch_id', 'prev_department_id',
        'prev_position_id', 'prev_employment_type', 'prev_job_level',
        'new_company_id',  'new_branch_id',  'new_department_id',
        'new_position_id',  'new_employment_type',  'new_job_level',
        'effective_date',
        'reason',
        'changed_by',
    ];

    protected $casts = [
        'effective_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    public function prevCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'prev_company_id');
    }

    public function newCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'new_company_id');
    }

    public function prevBranch(): BelongsTo
    {
        return $this->belongsTo(CompanyBranch::class, 'prev_branch_id');
    }

    public function newBranch(): BelongsTo
    {
        return $this->belongsTo(CompanyBranch::class, 'new_branch_id');
    }

    public function prevDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'prev_department_id');
    }

    public function newDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'new_department_id');
    }

    public function prevPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'prev_position_id');
    }

    public function newPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'new_position_id');
    }
}