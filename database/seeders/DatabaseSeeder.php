<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            WorkTimeFactorSeeder::class,
            CompanySeeder::class,
            CompanyBranchSeeder::class,
            DepartmentSeeder::class,
            PositionSeeder::class,
            DocumentTypeSeeder::class,
            EmployeeSeeder::class,
            EmployeePersonalInfoSeeder::class,
            EmployeeGovIdsSeeder::class,
            EmployeeBankAccountSeeder::class,
            EmployeeEmergencyContactSeeder::class,
            EmployeeWorkExperienceSeeder::class,
            EmploymentDetailsSeeder::class,
            EmployeeCompensationSeeder::class,
            EmployeeDocumentsSeeder::class,
        ]);
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
