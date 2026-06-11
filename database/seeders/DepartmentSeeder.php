<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['department_name' => 'Human Resources'],
            ['department_name' => 'Finance and Accounting'],
            ['department_name' => 'Information Technology'],
            ['department_name' => 'Operations'],
            ['department_name' => 'Sales and Marketing'],
            ['department_name' => 'Administration'],
            ['department_name' => 'Legal and Compliance'],
            ['department_name' => 'Customer Service'],
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }
    }
}