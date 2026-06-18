<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Employee;

class EmployeePersonalInfo extends Model
{
    protected $table = 'employee_personal_infos';

    protected $fillable = [
        'employee_id',
        'birth_date',
        'birth_place',
        'age',
        'gender',
        'civil_status',
        'nationality',
        'religion',
        'home_address',
        'current_address',
        'phone_number',
        'telephone_number',
        'email',
        'alternate_email',
        'highest_education',
        'course',
        'school',
        'profile_picture',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date:Y-m-d',
        'is_active'  => 'boolean',
        'age'        => 'integer',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }
}