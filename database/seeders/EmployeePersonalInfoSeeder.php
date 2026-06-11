<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeePersonalInfo;
use Illuminate\Support\Carbon;

class EmployeePersonalInfoSeeder extends Seeder
{
    public function run(): void
    {
        $infos = [
            [
                'employee_id'       => 1,
                'birth_date'        => '1990-05-15',
                'birth_place'       => 'Manila, Metro Manila',
                'age'               => 35,
                'gender'            => 'Male',
                'civil_status'      => 'Married',
                'nationality'       => 'Filipino',
                'religion'          => 'Roman Catholic',
                'home_address'      => '123 Rizal St., Taguig City',
                'current_address'   => '123 Rizal St., Taguig City',
                'phone_number'      => '09171234567',
                'telephone_number'  => '02-8111-2222',
                'email'             => 'juan.delacruz@company.com',
                'alternate_email'   => 'juandc@gmail.com',
                'highest_education' => 'Bachelor\'s Degree',
                'course'            => 'Business Administration',
                'school'            => 'University of Santo Tomas',
                'profile_picture'   => null,
                'is_active'         => true,
            ],
            [
                'employee_id'       => 2,
                'birth_date'        => '1993-08-22',
                'birth_place'       => 'Quezon City, Metro Manila',
                'age'               => 31,
                'gender'            => 'Female',
                'civil_status'      => 'Single',
                'nationality'       => 'Filipino',
                'religion'          => 'Roman Catholic',
                'home_address'      => '456 Mabini Ave., Quezon City',
                'current_address'   => '456 Mabini Ave., Quezon City',
                'phone_number'      => '09281234567',
                'telephone_number'  => null,
                'email'             => 'maria.garcia@company.com',
                'alternate_email'   => null,
                'highest_education' => 'Bachelor\'s Degree',
                'course'            => 'Human Resource Management',
                'school'            => 'De La Salle University',
                'profile_picture'   => null,
                'is_active'         => true,
            ],
            [
                'employee_id'       => 3,
                'birth_date'        => '1988-11-03',
                'birth_place'       => 'Cebu City, Cebu',
                'age'               => 36,
                'gender'            => 'Male',
                'civil_status'      => 'Married',
                'nationality'       => 'Filipino',
                'religion'          => 'Roman Catholic',
                'home_address'      => '789 Colon St., Cebu City',
                'current_address'   => '12 IT Park, Cebu City',
                'phone_number'      => '09391234567',
                'telephone_number'  => '032-111-2222',
                'email'             => 'pedro.reyes@company.com',
                'alternate_email'   => 'preyes88@yahoo.com',
                'highest_education' => 'Bachelor\'s Degree',
                'course'            => 'Computer Science',
                'school'            => 'University of San Carlos',
                'profile_picture'   => null,
                'is_active'         => true,
            ],
            [
                'employee_id'       => 4,
                'birth_date'        => '1995-03-18',
                'birth_place'       => 'Davao City, Davao del Sur',
                'age'               => 30,
                'gender'            => 'Female',
                'civil_status'      => 'Single',
                'nationality'       => 'Filipino',
                'religion'          => 'Protestant',
                'home_address'      => '321 Durian St., Davao City',
                'current_address'   => '321 Durian St., Davao City',
                'phone_number'      => '09501234567',
                'telephone_number'  => null,
                'email'             => 'ana.gonzales@company.com',
                'alternate_email'   => null,
                'highest_education' => 'Bachelor\'s Degree',
                'course'            => 'Accountancy',
                'school'            => 'Ateneo de Davao University',
                'profile_picture'   => null,
                'is_active'         => true,
            ],
            [
                'employee_id'       => 5,
                'birth_date'        => '1992-07-09',
                'birth_place'       => 'Pasig City, Metro Manila',
                'age'               => 33,
                'gender'            => 'Male',
                'civil_status'      => 'Single',
                'nationality'       => 'Filipino',
                'religion'          => 'Roman Catholic',
                'home_address'      => '654 Ortigas Ave., Pasig City',
                'current_address'   => '654 Ortigas Ave., Pasig City',
                'phone_number'      => '09611234567',
                'telephone_number'  => '02-8333-4444',
                'email'             => 'carlo.mendoza@company.com',
                'alternate_email'   => 'carlomendoza@gmail.com',
                'highest_education' => 'Master\'s Degree',
                'course'            => 'Information Technology',
                'school'            => 'Mapua University',
                'profile_picture'   => null,
                'is_active'         => true,
            ],
        ];

        foreach ($infos as $info) {
            EmployeePersonalInfo::create($info);
        }
    }
}