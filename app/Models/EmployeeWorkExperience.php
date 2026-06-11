<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeWorkExperience extends Model
{
    protected $table = 'employee_work_experiences';

    protected $fillable = [
        'employee_id',
        'company_name',
        'position',
        'department',
        'start_date',
        'end_date',
        'years_of_service',
        'remarks'
    ];

    protected $casts =[
        'start_date'        => 'date',
        'end_date'          => 'date',
        'years_of_service'  => 'decimal:2',
    ];

    // public function employee() : BelongsTo
    // {
    //     return $this->belongsTo(Employee::class, 'employee_id', 'id');
    // }

}
