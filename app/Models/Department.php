<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\EmploymentDetails;

class Department extends Model
{
    protected $table = 'departments';

    protected $fillable = [
        'department_name'
    ];

    public function employmentDetail() : HasMany
    {
        return $this->hasMany(EmploymentDetails::class, 'department_id', 'id');
    }
}
