<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeBankAccount;

class EmployeeBankAccountSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'employee_id'           => 1,
                'bank_name'             => 'BDO Unibank',
                'account_number'        => '1234567890',
                'atm_card_number'       => '4111111111111111',
                'atm_status'            => 'Active',
                'gcash_account_number'  => '09171234567',
                'gcash_account_name'    => 'Juan R. dela Cruz',
                'other_bank_type'       => null,
                'other_bank_name'       => null,
                'other_account_number'  => null,
                'other_account_name'    => null,
            ],
            [
                'employee_id'           => 2,
                'bank_name'             => 'Metrobank',
                'account_number'        => '2345678901',
                'atm_card_number'       => '4222222222222222',
                'atm_status'            => 'Active',
                'gcash_account_number'  => '09281234567',
                'gcash_account_name'    => 'Maria S. Garcia',
                'other_bank_type'       => null,
                'other_bank_name'       => null,
                'other_account_number'  => null,
                'other_account_name'    => null,
            ],
            [
                'employee_id'           => 3,
                'bank_name'             => 'BPI',
                'account_number'        => '3456789012',
                'atm_card_number'       => '4333333333333333',
                'atm_status'            => 'Active',
                'gcash_account_number'  => null,
                'gcash_account_name'    => null,
                'other_bank_type'       => 'Digital Bank',
                'other_bank_name'       => 'Maya Bank',
                'other_account_number'  => '09391234567',
                'other_account_name'    => 'Pedro L. Reyes Jr.',
            ],
            [
                'employee_id'           => 4,
                'bank_name'             => 'UnionBank',
                'account_number'        => '4567890123',
                'atm_card_number'       => '4444444444444444',
                'atm_status'            => 'Active',
                'gcash_account_number'  => '09501234567',
                'gcash_account_name'    => 'Ana C. Gonzales',
                'other_bank_type'       => null,
                'other_bank_name'       => null,
                'other_account_number'  => null,
                'other_account_name'    => null,
            ],
            [
                'employee_id'           => 5,
                'bank_name'             => 'BDO Unibank',
                'account_number'        => '5678901234',
                'atm_card_number'       => '4555555555555555',
                'atm_status'            => 'Active',
                'gcash_account_number'  => '09611234567',
                'gcash_account_name'    => 'Carlo B. Mendoza',
                'other_bank_type'       => null,
                'other_bank_name'       => null,
                'other_account_number'  => null,
                'other_account_name'    => null,
            ],
        ];

        foreach ($accounts as $account) {
            EmployeeBankAccount::create($account);
        }
    }
}