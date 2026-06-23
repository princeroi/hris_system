<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class EmployeeReassignmentLog extends Model
{
    protected $fillable = [
        'employee_id',
 
        // ── Previous ────────────────────────────────────────────────────────
        'prev_company_id',
        'prev_branch_id',
        'prev_department_id',
        'prev_position_id',
        'prev_employment_type',
        'prev_contract_status',            // enum: no_contract | valid | expired
        'prev_contract_date_from',
        'prev_contract_date_to',
        'prev_regularization_date',        // NEW
        'prev_probationary_period_months', // NEW
        'prev_probationary_evaluation_date', // NEW
 
        // ── New ─────────────────────────────────────────────────────────────
        'new_company_id',
        'new_branch_id',
        'new_department_id',
        'new_position_id',
        'new_employment_type',
        'new_contract_status',             // enum: no_contract | valid | expired
        'new_contract_date_from',
        'new_contract_date_to',
        'new_regularization_date',         // NEW
        'new_probationary_period_months',  // NEW
        'new_probationary_evaluation_date', // NEW
 
        // ── Meta ─────────────────────────────────────────────────────────────
        'effective_date',
        'reason',
        'changed_by',
        'is_processed',
        'processed_at',
    ];
 
    protected $casts = [
        'effective_date'                      => 'date',
        'prev_contract_date_from'             => 'date',
        'prev_contract_date_to'               => 'date',
        'new_contract_date_from'              => 'date',
        'new_contract_date_to'                => 'date',
        'prev_regularization_date'            => 'date',
        'new_regularization_date'             => 'date',
        'prev_probationary_evaluation_date'   => 'date',
        'new_probationary_evaluation_date'    => 'date',
        'prev_probationary_period_months'     => 'integer',
        'new_probationary_period_months'      => 'integer',
        'is_processed'                        => 'boolean',
        'processed_at'                        => 'datetime',
    ];
 
    // ── Relationships ─────────────────────────────────────────────────────────
 
    public function employee()       { return $this->belongsTo(Employee::class); }
    public function changedBy()      { return $this->belongsTo(User::class, 'changed_by'); }
    public function prevCompany()    { return $this->belongsTo(Company::class, 'prev_company_id'); }
    public function newCompany()     { return $this->belongsTo(Company::class, 'new_company_id'); }
    public function prevBranch()     { return $this->belongsTo(CompanyBranch::class, 'prev_branch_id'); }
    public function newBranch()      { return $this->belongsTo(CompanyBranch::class, 'new_branch_id'); }
    public function prevDepartment() { return $this->belongsTo(Department::class, 'prev_department_id'); }
    public function newDepartment()  { return $this->belongsTo(Department::class, 'new_department_id'); }
    public function prevPosition()   { return $this->belongsTo(Position::class, 'prev_position_id'); }
    public function newPosition()    { return $this->belongsTo(Position::class, 'new_position_id'); }
 
    // ── Scopes ────────────────────────────────────────────────────────────────
 
    public function scopePendingToday($query)
    {
        return $query
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString());
    }
}