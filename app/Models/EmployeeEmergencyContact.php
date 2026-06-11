<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employee;

class EmployeeEmergencyContact extends Model
{
    protected $table = 'employee_emergency_contacts';

    protected $fillable = [
        'employee_id',
        'contact_person_name',
        'contact_person_relationship',
        'contact_person_phone',
        'contact_person_telephone',
        'contact_person_address',
    ];

    // public function employee(): BelongsTo
    // {
    //     return $this->belongsTo(Employee::class, 'employee_id', 'id');
    // }
}
