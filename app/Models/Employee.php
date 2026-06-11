<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\EmployeePersonalInfo;
use App\Models\EmployeeGovIds;
use App\Models\EmployeeBankAccount;
use App\Models\EmployeeEmergencyContact;
use App\Models\EmployeeWorkExperiance;
use App\Models\EmployeeCompensation;
use App\Models\EmployeeDocuments;

class Employee extends Model
{
    use SoftDeletes;

    protected $table = 'employees';

    protected $fillable = [
        'employee_number',
        'first_name',
        'middle_name',
        'last_name',
        'suffix', 
    ];

    public function personalInfo(): HasOne
    {
        return $this->hasOne(EmployeePersonalInfo::class, 'employee_id', 'id');
    }

    public function govIds(): HasOne
    {
        return $this->hasOne(EmployeeGovIds::class, 'employee_id', 'id');
    }

    public function bankAccount(): HasOne
    {
        return $this->hasOne(EmployeeBankAccount::class, 'employee_id', 'id');
    }

    public function emergencyContacts() : HasMany 
    {
        return $this->hasMany(EmployeeEmergencyContact::class, 'employee_id', 'id');
    }

    public function workExperience() : HasMany 
    {
        return $this->hasMany(EmployeeWorkExperience::class, 'employee_id', 'id');
    }

    // Current compensation only (is_current = true)
    public function compensation(): HasOne
    {
        return $this->hasOne(EmployeeCompensation::class, 'employee_id')
                    ->where('is_current', true);
    }

    // All compensation history
    public function compensationLogs(): HasMany
    {
        return $this->hasMany(EmployeeCompensation::class, 'employee_id')
                    ->orderBy('effective_date', 'desc');
    }

    public function document() : HasMany 
    {
        return $this->hasMany(EmployeeDocuments::class, 'employee_id', 'id');
    }

    public function employmentDetails() : hasOne 
    {
        return $this->hasOne(EmploymentDetails::class, 'employee_id', 'id');
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(EmployeeStatusLog::class);
    }
}
