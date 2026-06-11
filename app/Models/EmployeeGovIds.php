<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Employee;

class EmployeeGovIds extends Model
{
    protected $table = 'employee_gov_ids';

    protected $fillable = [
        'employee_id',
        'sss_number',
        'sss_status',
        'sss_remarks',
        'pagibig_number',
        'pagibig_status',
        'pagibig_remarks',
        'philhealth_number',
        'philhealth_status',
        'philhealth_remarks',
        'tin_number',
        'tin_status',
        'tin_remarks',
    ];

    // public function employee(): BelongsTo
    // {
    //     return $this->belongsTo(Employee::class, 'employee_id', 'id');
    // }
}
