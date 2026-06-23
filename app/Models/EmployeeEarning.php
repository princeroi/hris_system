<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeEarning extends Model
{
    protected $fillable = [
        'employee_id',
        'earning_id',
        'amount',
        'frequency',
        'is_continuous',
        'effective_date',
        'end_date',
    ];

    protected $casts = [
        'amount'         => 'decimal:2',
        'is_continuous'  => 'boolean',
        'is_active'      => 'boolean',
        'effective_date' => 'date',
        'end_date'       => 'date',
    ];

    // ── Frequency options ──────────────────────────────────────────────────────

    const FREQUENCIES = [
        'one-time'     => 'One-time',
        'daily'        => 'Daily',
        'weekly'       => 'Weekly',
        'bi-weekly'    => 'Bi-weekly',
        'semi-monthly' => 'Semi-monthly',
        'monthly'      => 'Monthly',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function earning(): BelongsTo
    {
        return $this->belongsTo(Earning::class);
    }
}