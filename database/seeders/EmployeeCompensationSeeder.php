<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeCompensation;

class EmployeeCompensationSeeder extends Seeder
{
    public function run(): void
    {
        $compensations = [
            [
                'employee_id'    => 1,
                'monthly_rate'   => 45000.00,
                'daily_rate'     => 2068.97,
                'hourly_rate'    => 258.62,
                'payroll_type'   => 'semi_monthly',
                'salary_type'    => 'daily_rate',
                'effective_date' => '2020-06-01',
                'is_current'     => true,
            ],
            [
                'employee_id'    => 2,
                'monthly_rate'   => 35000.00,
                'daily_rate'     => 1609.20,
                'hourly_rate'    => 201.15,
                'payroll_type'   => 'semi_monthly',
                'salary_type'    => 'daily_rate',
                'effective_date' => '2019-03-15',
                'is_current'     => true,
            ],
            [
                'employee_id'    => 3,
                'monthly_rate'   => 60000.00,
                'daily_rate'     => 2758.62,
                'hourly_rate'    => 344.83,
                'payroll_type'   => 'semi_monthly',
                'salary_type'    => 'daily_rate',
                'effective_date' => '2020-08-01',
                'is_current'     => true,
            ],
            [
                'employee_id'    => 4,
                'monthly_rate'   => 32000.00,
                'daily_rate'     => 1471.26,
                'hourly_rate'    => 183.91,
                'payroll_type'   => 'semi_monthly',
                'salary_type'    => 'daily_rate',
                'effective_date' => '2021-07-01',
                'is_current'     => true,
            ],
            [
                'employee_id'    => 5,
                'monthly_rate'   => 75000.00,
                'daily_rate'     => 3448.28,
                'hourly_rate'    => 431.03,
                'payroll_type'   => 'semi_monthly',
                'salary_type'    => 'daily_rate',
                'effective_date' => '2019-10-01',
                'is_current'     => true,
            ],
        ];

        foreach ($compensations as $compensation) {
            EmployeeCompensation::create($compensation);
        }
    }
}