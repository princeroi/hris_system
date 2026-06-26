<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class EmployeeCompensationLog extends Model
{
    protected $table = 'employee_compensation_logs';

    protected $fillable = [
        'employee_id',
        'prev_work_time_factor_id',
        'prev_monthly_rate',
        'prev_daily_rate',
        'prev_hourly_rate',
        'prev_payroll_type',
        'prev_salary_type',
        'new_work_time_factor_id',
        'new_monthly_rate',
        'new_daily_rate',
        'new_hourly_rate',
        'new_payroll_type',
        'new_salary_type',
        'effective_date',
        'reason',
        'changed_by',
        'is_processed',  
        'processed_at',  
    ];

    protected $casts = [
        'monthly_rate'   => 'decimal:2',
        'daily_rate'     => 'decimal:2',
        'hourly_rate'    => 'decimal:2',
        'effective_date' => 'date',
        'is_processed'      => 'boolean',  
        'processed_at'      => 'datetime',  
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function workTimeFactor(): BelongsTo
    {
        return $this->belongsTo(WorkTimeFactor::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'changed_by');
    }
    
    public function scopePendingToday($query)
    {
        return $query
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString());
    }
}