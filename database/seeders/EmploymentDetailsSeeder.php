<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmploymentDetails;

class EmploymentDetailsSeeder extends Seeder
{
    public function run(): void
    {
        $details = [
            [
                'employee_id'                   => 1,
                'hired_date'                    => '2020-06-01',
                'regularization_date'           => '2020-12-01',
                'contract_date_from'            => null,
                'contract_date_to'              => null,
                'contract_status'               => 'valid',
                'employment_type'                 => 'regular',
                'status'             => 'active',
                'company_id'                    => 1,
                'branch_id'                     => 1,
                'department_id'                 => 1,
                'position_id'                   => 2,
                'job_level'                     => 'Supervisor',
                'probationary_period_months'    => 6,
                'probationary_evaluation_date'  => '2020-11-25',
            ],
            [
                'employee_id'                   => 2,
                'hired_date'                    => '2019-03-15',
                'regularization_date'           => '2019-09-15',
                'contract_date_from'            => null,
                'contract_date_to'              => null,
                'contract_status'               => 'valid',
                'employment_type'                 => 'regular',
                'status'             => 'active',
                'company_id'                    => 1,
                'branch_id'                     => 1,
                'department_id'                 => 1,
                'position_id'                   => 3,
                'job_level'                     => 'Staff',
                'probationary_period_months'    => 6,
                'probationary_evaluation_date'  => '2019-09-10',
            ],
            [
                'employee_id'                   => 3,
                'hired_date'                    => '2020-08-01',
                'regularization_date'           => '2021-02-01',
                'contract_date_from'            => null,
                'contract_date_to'              => null,
                'contract_status'               => 'valid',
                'employment_type'                 => 'regular',
                'status'             => 'active',
                'company_id'                    => 2,
                'branch_id'                     => 3,
                'department_id'                 => 3,
                'position_id'                   => 7,
                'job_level'                     => 'Senior',
                'probationary_period_months'    => 6,
                'probationary_evaluation_date'  => '2021-01-25',
            ],
            [
                'employee_id'                   => 4,
                'hired_date'                    => '2021-07-01',
                'regularization_date'           => '2022-01-01',
                'contract_date_from'            => null,
                'contract_date_to'              => null,
                'contract_status'               => 'valid',
                'employment_type'                 => 'regular',
                'status'             => 'active',
                'company_id'                    => 2,
                'branch_id'                     => 4,
                'department_id'                 => 2,
                'position_id'                   => 5,
                'job_level'                     => 'Staff',
                'probationary_period_months'    => 6,
                'probationary_evaluation_date'  => '2021-12-25',
            ],
            [
                'employee_id'                   => 5,
                'hired_date'                    => '2019-10-01',
                'regularization_date'           => '2020-04-01',
                'contract_date_from'            => null,
                'contract_date_to'              => null,
                'contract_status'               => 'valid',
                'employment_type'                 => 'regular',
                'status'             => 'active',
                'company_id'                    => 3,
                'branch_id'                     => 5,
                'department_id'                 => 3,
                'position_id'                   => 6,
                'job_level'                     => 'Manager',
                'probationary_period_months'    => 6,
                'probationary_evaluation_date'  => '2020-03-25',
            ],
        ];

        foreach ($details as $detail) {
            EmploymentDetails::create($detail);
        }
    }
}