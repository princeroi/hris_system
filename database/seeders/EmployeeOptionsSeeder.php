<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeOptionsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'gender' => ["Male", "Female"],
            'civil_status' => ["Single", "Married", "Divorced", "Widowed"],
            'employment_type' => ["probationary", "regular", "project_based", "contractual", "reliever", "part_time", "intern"],
            'status' => ["active", "inactive", "terminated", "resigned", "retired", "contract_end"],
            'contract_status' => ["valid", "expired", "renewed", "terminated"],
            'job_level' => ["Junior", "Mid-level", "Senior", "Lead", "Manager", "Director"],
            'sss_status' => ["for_verification", "verified", "no_sss"],
            'pagibig_status' => ["for_verification", "verified", "no_pagibig"],
            'philhealth_status' => ["for_verification", "verified", "no_philhealth"],
            'tin_status' => ["for_verification", "verified", "no_tin"],
            'atm_status' => ["pending", "released", "active", "inactive"],
            'payroll_type' => ["monthly", "semi_monthly", "weekly", "daily", "hourly"],
            'salary_type' => ["monthly_rate", "semi_monthly_rate", "weekly_rate", "daily_rate", "hourly_rate"],
        ];

        foreach ($data as $group => $values) {
            $groupId = DB::table('option_groups')->insertGetId([
                'group' => $group,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($values as $value) {
                DB::table('options')->insert([
                    'group_id' => $groupId,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
