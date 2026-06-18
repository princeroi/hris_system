<?php
// app/Http/Requests/ChangeStatusRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'new_status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                    'on_leave',
                    'terminated',
                    'resigned',
                    'retired',
                    'contract_end',
                ]),
            ],
            'effective_date'    => ['required', 'date'],
            'last_working_date' => ['nullable', 'date'],
            'reason'            => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'new_status.required'     => 'Please select a new status.',
            'new_status.in'           => 'Invalid status selected.',
            'effective_date.required' => 'Effective date is required.',
            'effective_date.date'     => 'Please enter a valid effective date.',
            'last_working_date.date'  => 'Please enter a valid last working date.',
        ];
    }
}