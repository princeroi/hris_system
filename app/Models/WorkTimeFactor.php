<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkTimeFactor extends Model
{
    protected $table = 'work_time_factors';

    protected $fillable = [
        'factor_name',
        'factor_description',
        'working_days_per_week',
        'working_hours_per_day',
        'working_hours_per_week',
        'working_days_per_year',
        'working_hours_per_year',
        'working_days_per_month',
        'working_hours_per_month',
    ];
}
