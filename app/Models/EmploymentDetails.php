<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Departments;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\CompanyBranch;

class EmploymentDetails extends Model
{
    protected $table = 'employment_details';

    protected $fillable = [
        'employee_id',
        'hired_date',
        'regularization_date',
        'contract_date_from',
        'contract_date_to',
        'contract_status',
        'employment_type',
        'status',
        'company_id',
        'branch_id',
        'department_id',
        'position_id',
        'job_level',
        'probationary_period_months',
        'probationary_evaluation_date',
    ];

    protected $casts = [
        'hired_date'                        => 'date:Y-m-d',
        'regularization_date'               => 'date:Y-m-d',
        'contract_date_from'                => 'date:Y-m-d',
        'contract_date_to'                  => 'date:Y-m-d',
        'probationary_period_months'        => 'integer',
        'probationary_evaluation_date'      => 'date:Y-m-d',
    ];

    public function company() : BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'id');
    }

    public function department() : BelongsTo 
    {
        return $this->belongsTo(Department::class, 'department_id', 'id');
    }
    
    public function position() : BelongsTo 
    {
        return $this->belongsTo(Position::class, 'position_id', 'id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(CompanyBranch::class, 'branch_id', 'id');
    }
}
