<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\EmploymentDetails;

class Position extends Model
{
    protected $table = 'positions';

    protected $fillable = [
        'position_name',
        'position_description'
    ];

    public function employmentDetail() : HasMany 
    {
        return $this->hasMany(EmploymentDetails::class, 'position_id', 'id');
    }
}
