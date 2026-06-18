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
    ];

    protected $casts = [
        'effective_date'    => 'date',
        'last_working_date' => 'date',
        'applied_at'        => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}