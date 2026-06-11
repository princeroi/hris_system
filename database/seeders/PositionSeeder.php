<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Position;

class PositionSeeder extends Seeder
{
    public function run(): void
    {
        $positions = [
            ['position_name' => 'Chief Executive Officer',      'position_description' => 'Leads the overall direction and strategy of the company'],
            ['position_name' => 'HR Manager',                   'position_description' => 'Manages human resources functions including recruitment and employee relations'],
            ['position_name' => 'HR Officer',                   'position_description' => 'Assists HR manager with day-to-day HR operations'],
            ['position_name' => 'Finance Manager',              'position_description' => 'Oversees financial planning, reporting, and compliance'],
            ['position_name' => 'Accountant',                   'position_description' => 'Handles bookkeeping, payroll, and financial records'],
            ['position_name' => 'IT Manager',                   'position_description' => 'Manages IT infrastructure and technical teams'],
            ['position_name' => 'Software Developer',           'position_description' => 'Designs and develops software applications'],
            ['position_name' => 'Operations Supervisor',        'position_description' => 'Supervises day-to-day operational activities'],
            ['position_name' => 'Sales Representative',         'position_description' => 'Handles client acquisition and sales targets'],
            ['position_name' => 'Administrative Assistant',     'position_description' => 'Provides clerical and administrative support'],
        ];

        foreach ($positions as $position) {
            Position::create($position);
        }
    }
}