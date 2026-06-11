<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyBranch extends Model
{
    protected $table = 'company_branches';

    protected $fillable = [
        'company_id',
        'branch_name',
        'branch_location',
        'branch_contact_person',
        'branch_contact_number',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'id');
    }

    public function employmentDetail(): HasMany
    {
        return $this->hasMany(EmploymentDetails::class, 'branch_id', 'id'); // ← branch_id
    }
}