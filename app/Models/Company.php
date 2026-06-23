<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $table = 'companies';

    protected $fillable = [
        'company_name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function employmentDetail(): HasMany
    {
        return $this->hasMany(EmploymentDetails::class, 'company_id');
    }

    public function branches() : HasMany
    {
        return $this->hasMany(CompanyBranch::class, 'company_id');
    }
}