<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            ['company_name' => 'Acme Corporation',       'is_active' => true],
            ['company_name' => 'Bright Solutions Inc.',  'is_active' => true],
            ['company_name' => 'Sunrise Enterprises',    'is_active' => true],
            ['company_name' => 'Metro Holdings Co.',     'is_active' => true],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }
    }
}