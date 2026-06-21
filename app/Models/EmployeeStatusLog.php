<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeStatusLog extends Model
{
    protected $fillable = [
        'employee_id',
        'type',
        'previous_status',
        'new_status',
        'effective_date',
        'last_working_date',
        'reason',
        'changed_by',
        'applied_at',
        'is_processed',
        'processed_at',
    ];

    protected $casts = [
        'effective_date'    => 'date',
        'last_working_date' => 'date',
        'applied_at'        => 'datetime',
        'processed_at'      => 'datetime',
        'is_processed'      => 'boolean',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    public function scopePendingToday($query)
    {
        return $query
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString());
    }
}