<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RelieverDutyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reliever_employee_id' => ['required', 'integer', 'exists:employees,id'],
            'duty_type'            => ['required', Rule::in(['vacant_post', 'cover_up'])],
            'covered_employee_id'  => [
                'nullable',
                'integer',
                'exists:employees,id',
                Rule::requiredIf(fn () => $this->input('duty_type') === 'cover_up'),
            ],
            'company_id'    => ['nullable', 'integer', 'exists:companies,id'],
            'branch_id'     => ['nullable', 'integer', 'exists:company_branches,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'position_id'   => ['nullable', 'integer', 'exists:positions,id'],

            'dates'   => ['required', 'array', 'min:1'],
            'dates.*' => ['required', 'date_format:Y-m-d'],

            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reliever_employee_id.required' => 'Please select a reliever employee.',
            'reliever_employee_id.exists'   => 'Selected reliever is invalid.',
            'duty_type.required'            => 'Duty type is required.',
            'duty_type.in'                  => 'Duty type must be Vacant Post or Cover-Up.',
            'covered_employee_id.required'  => 'Covered employee is required for Cover-Up duty.',
            'covered_employee_id.exists'    => 'Selected covered employee is invalid.',
            'company_id.exists'             => 'Selected company is invalid.',
            'branch_id.exists'              => 'Selected branch is invalid.',
            'department_id.exists'          => 'Selected department is invalid.',
            'position_id.exists'            => 'Selected position is invalid.',
            'dates.required'                => 'Please select at least one duty date.',
            'dates.min'                     => 'Please select at least one duty date.',
            'dates.*.date_format'           => 'Each date must be in YYYY-MM-DD format.',
        ];
    }
}