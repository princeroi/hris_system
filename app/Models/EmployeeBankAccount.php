<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Employee;

class EmployeeBankAccount extends Model
{
    protected $table = 'employee_bank_accounts';

    protected $fillable = [
        'employee_id',
        'bank_name',
        'account_number',
        'atm_card_number',
        'atm_status',
        'gcash_account_number',
        'gcash_account_name',
        'other_bank_type',
        'other_bank_name',
        'other_account_number',
        'other_account_name',
    ];

    // public function employee(): BelongsTo
    // {
    //     return $this->belongsTo(Employee::class, 'employee_id', 'id');
    // }
}
