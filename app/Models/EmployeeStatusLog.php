<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class EmployeeStatusLog extends Model
{
    protected $fillable = [
        'employee_id',
        'previous_status',
        'new_status',
        'effective_date',
        'last_working_date',
        'reason',
        'changed_by',
    ];

    protected $casts = [
        'effective_date'   => 'date',
        'last_working_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}