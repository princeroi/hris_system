<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            ['employee_number' => 'EMP-0001', 'first_name' => 'Juan',      'middle_name' => 'Reyes',     'last_name' => 'dela Cruz',  'suffix' => null],
            ['employee_number' => 'EMP-0002', 'first_name' => 'Maria',     'middle_name' => 'Santos',    'last_name' => 'Garcia',     'suffix' => null],
            ['employee_number' => 'EMP-0003', 'first_name' => 'Pedro',     'middle_name' => 'Lim',       'last_name' => 'Reyes',      'suffix' => 'Jr.'],
            ['employee_number' => 'EMP-0004', 'first_name' => 'Ana',       'middle_name' => 'Cruz',      'last_name' => 'Gonzales',   'suffix' => null],
            ['employee_number' => 'EMP-0005', 'first_name' => 'Carlo',     'middle_name' => 'Bautista',  'last_name' => 'Mendoza',    'suffix' => null],
            ['employee_number' => 'EMP-0006', 'first_name' => 'Rosa',      'middle_name' => 'Torres',    'last_name' => 'Villanueva', 'suffix' => null],
            ['employee_number' => 'EMP-0007', 'first_name' => 'Jose',      'middle_name' => 'Aquino',    'last_name' => 'Ramos',      'suffix' => 'III'],
            ['employee_number' => 'EMP-0008', 'first_name' => 'Luz',       'middle_name' => 'Pascual',   'last_name' => 'Castillo',   'suffix' => null],
            ['employee_number' => 'EMP-0009', 'first_name' => 'Ramon',     'middle_name' => 'Dela Pena', 'last_name' => 'Flores',     'suffix' => null],
            ['employee_number' => 'EMP-0010', 'first_name' => 'Cristina',  'middle_name' => 'Navarro',   'last_name' => 'Morales',    'suffix' => null],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}