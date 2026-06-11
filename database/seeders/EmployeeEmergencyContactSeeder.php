<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeEmergencyContact;

class EmployeeEmergencyContactSeeder extends Seeder
{
    public function run(): void
    {
        $contacts = [
            [
                'employee_id'                   => 1,
                'contact_person_name'           => 'Maria dela Cruz',
                'contact_person_relationship'   => 'Spouse',
                'contact_person_phone'          => '09179876543',
                'contact_person_telephone'      => '02-8111-9999',
                'contact_person_address'        => '123 Rizal St., Taguig City',
            ],
            [
                'employee_id'                   => 2,
                'contact_person_name'           => 'Roberto Garcia',
                'contact_person_relationship'   => 'Father',
                'contact_person_phone'          => '09289876543',
                'contact_person_telephone'      => null,
                'contact_person_address'        => '456 Mabini Ave., Quezon City',
            ],
            [
                'employee_id'                   => 3,
                'contact_person_name'           => 'Lourdes Reyes',
                'contact_person_relationship'   => 'Spouse',
                'contact_person_phone'          => '09399876543',
                'contact_person_telephone'      => '032-111-3333',
                'contact_person_address'        => '789 Colon St., Cebu City',
            ],
            [
                'employee_id'                   => 4,
                'contact_person_name'           => 'Carmen Gonzales',
                'contact_person_relationship'   => 'Mother',
                'contact_person_phone'          => '09509876543',
                'contact_person_telephone'      => null,
                'contact_person_address'        => '321 Durian St., Davao City',
            ],
            [
                'employee_id'                   => 5,
                'contact_person_name'           => 'Ernesto Mendoza',
                'contact_person_relationship'   => 'Father',
                'contact_person_phone'          => '09619876543',
                'contact_person_telephone'      => '02-8333-5555',
                'contact_person_address'        => '654 Ortigas Ave., Pasig City',
            ],
        ];

        foreach ($contacts as $contact) {
            EmployeeEmergencyContact::create($contact);
        }
    }
}