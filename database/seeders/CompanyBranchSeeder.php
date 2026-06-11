<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CompanyBranch;

class CompanyBranchSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            ['id' => 1, 'company_id' => 1, 'branch_name' => 'Main Branch',     'branch_location' => 'Manila'],
            ['id' => 2, 'company_id' => 1, 'branch_name' => 'North Branch',    'branch_location' => 'Quezon City'],
            ['id' => 3, 'company_id' => 2, 'branch_name' => 'South Branch',    'branch_location' => 'Cebu City'],
            ['id' => 4, 'company_id' => 2, 'branch_name' => 'East Branch',     'branch_location' => 'Davao'],
            ['id' => 5, 'company_id' => 3, 'branch_name' => 'West Branch',     'branch_location' => 'Iloilo'],
        ];

        foreach ($branches as $branch) {
            CompanyBranch::create($branch);
        }
    }
}