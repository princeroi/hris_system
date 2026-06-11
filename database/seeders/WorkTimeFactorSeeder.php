<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkTimeFactor;

class WorkTimeFactorSeeder extends Seeder
{
    public function run(): void
    {
        $factors = [
            [
                'factor_name'               => 'Standard 8-Hour Workday',
                'factor_description'        => 'Standard Philippine labor law working hours',
                'working_days_per_week'     => 5,
                'working_hours_per_day'     => 8,
                'working_hours_per_week'    => 40,
                'working_days_per_year'     => 261,
                'working_hours_per_year'    => 2088,
                'working_days_per_month'    => 21.75,
                'working_hours_per_month'   => 174,
            ],
            [
                'factor_name'               => '6-Day Work Week',
                'factor_description'        => 'Six-day work week with 8 hours per day',
                'working_days_per_week'     => 6,
                'working_hours_per_day'     => 8,
                'working_hours_per_week'    => 48,
                'working_days_per_year'     => 313,
                'working_hours_per_year'    => 2504,
                'working_days_per_month'    => 26,
                'working_hours_per_month'   => 208,
            ],
            [
                'factor_name'               => 'Part-Time 4-Hour',
                'factor_description'        => 'Part-time arrangement with 4 working hours per day',
                'working_days_per_week'     => 5,
                'working_hours_per_day'     => 4,
                'working_hours_per_week'    => 20,
                'working_days_per_year'     => 261,
                'working_hours_per_year'    => 1044,
                'working_days_per_month'    => 21.75,
                'working_hours_per_month'   => 87,
            ],
        ];

        foreach ($factors as $factor) {
            WorkTimeFactor::create($factor);
        }
    }
}