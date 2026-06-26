<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeEarningLog extends Model
{
    protected $table = 'employee_earning_logs';

    protected $fillable = [
        'employee_id',
        'earning_id',
        'action',
        'prev_amount',
        'prev_frequency',
        'new_amount',
        'new_frequency',
        'effective_date',
        'reason',
        'changed_by',
        'is_processed',
        'processed_at',
    ];

    protected $casts = [
        'prev_amount'    => 'decimal:2',
        'new_amount'     => 'decimal:2',
        'effective_date' => 'date',
        'is_processed'   => 'boolean',
        'processed_at'   => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function earning(): BelongsTo
    {
        return $this->belongsTo(Earning::class);
    }

    public function changedBy(): BelongsTo
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