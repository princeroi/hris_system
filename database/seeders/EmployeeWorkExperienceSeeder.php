<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeWorkExperience;

class EmployeeWorkExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            // Employee 1
            [
                'employee_id'       => 1,
                'company_name'      => 'Global Corp Philippines',
                'position'          => 'HR Assistant',
                'department'        => 'Human Resources',
                'start_date'        => '2013-06-01',
                'end_date'          => '2016-12-31',
                'years_of_service'  => 3.58,
                'remarks'           => 'Resigned for better opportunity',
            ],
            [
                'employee_id'       => 1,
                'company_name'      => 'Horizon Solutions Inc.',
                'position'          => 'HR Officer',
                'department'        => 'Human Resources',
                'start_date'        => '2017-01-15',
                'end_date'          => '2020-05-31',
                'years_of_service'  => 3.38,
                'remarks'           => 'Promoted and transferred',
            ],
            // Employee 2
            [
                'employee_id'       => 2,
                'company_name'      => 'Apex Staffing Agency',
                'position'          => 'Recruitment Coordinator',
                'department'        => 'Recruitment',
                'start_date'        => '2016-03-01',
                'end_date'          => '2019-02-28',
                'years_of_service'  => 3.00,
                'remarks'           => 'Contract ended',
            ],
            // Employee 3
            [
                'employee_id'       => 3,
                'company_name'      => 'TechBridge Systems',
                'position'          => 'Junior Developer',
                'department'        => 'Software Development',
                'start_date'        => '2011-07-01',
                'end_date'          => '2015-06-30',
                'years_of_service'  => 4.00,
                'remarks'           => null,
            ],
            [
                'employee_id'       => 3,
                'company_name'      => 'CodeHub Cebu',
                'position'          => 'Senior Developer',
                'department'        => 'Engineering',
                'start_date'        => '2015-08-01',
                'end_date'          => '2020-07-31',
                'years_of_service'  => 5.00,
                'remarks'           => 'Company closed',
            ],
            // Employee 4
            [
                'employee_id'       => 4,
                'company_name'      => 'Southern Accounting Firm',
                'position'          => 'Junior Accountant',
                'department'        => 'Finance',
                'start_date'        => '2018-05-15',
                'end_date'          => '2021-05-14',
                'years_of_service'  => 3.00,
                'remarks'           => 'Sought growth in corporate sector',
            ],
            // Employee 5
            [
                'employee_id'       => 5,
                'company_name'      => 'DataLogic Philippines',
                'position'          => 'IT Support Specialist',
                'department'        => 'Information Technology',
                'start_date'        => '2015-09-01',
                'end_date'          => '2019-08-31',
                'years_of_service'  => 4.00,
                'remarks'           => null,
            ],
        ];

        foreach ($experiences as $experience) {
            EmployeeWorkExperience::create($experience);
        }
    }
}