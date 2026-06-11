<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
class EmployeeCompensation extends Model
{
    protected $table = 'employee_compensation';

    protected $fillable = [
        'employee_id',
        'work_time_factor_id',
        'monthly_rate',
        'daily_rate',
        'hourly_rate',
        'payroll_type',
        'salary_type',
        'effective_date',
        'is_current',
    ];

    protected $casts = [
        'monthly_rate'      => 'decimal:2',
        'daily_rate'        => 'decimal:2',
        'hourly_rate'       => 'decimal:2',
        'effective_date'    => 'date',
        'is_current'        => 'boolean',
    ];

    // public function employee() : BelongsTo
    // {
    //     return $this->belongsTo(Employee::class, 'employee_id', 'id');
    // }

    public function workTimeFactor() : HasOne 
    {
        return $this->hasOne(WorkTimeFactor::class, 'EmployeeCompensation', 'id');
    }
    
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
