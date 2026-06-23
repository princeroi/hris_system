<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $employeeId = $this->route('employee')?->id;

        return [
            // ── Employee ──────────────────────────────────────────────
            'employee_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('employees', 'employee_number')->ignore($employeeId),
            ],
            'first_name'  => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name'   => ['required', 'string', 'max:255'],
            'suffix'      => ['nullable', 'string', 'max:50'],

            // ── Personal Info ─────────────────────────────────────────
            'birth_date'        => ['nullable', 'date'],
            'birth_place'       => ['nullable', 'string', 'max:255'],
            'age'               => ['nullable', 'integer', 'min:0', 'max:150'],
            'gender'            => ['nullable', Rule::in(['Male', 'Female'])],
            'civil_status'      => ['nullable', Rule::in(['Single', 'Married', 'Divorced', 'Widowed'])],
            'nationality'       => ['nullable', 'string', 'max:100'],
            'religion'          => ['nullable', 'string', 'max:100'],
            'home_address'      => ['nullable', 'string', 'max:500'],
            'current_address'   => ['nullable', 'string', 'max:500'],
            'phone_number'      => ['nullable', 'string', 'max:20'],
            'telephone_number'  => ['nullable', 'string', 'max:20'],
            'email'             => ['nullable', 'email', 'max:255'],
            'alternate_email'   => ['nullable', 'email', 'max:255'],
            'highest_education' => ['nullable', 'string', 'max:100'],
            'course'            => ['nullable', 'string', 'max:100'],
            'school'            => ['nullable', 'string', 'max:255'],

            // ── Employment Details ────────────────────────────────────
            'hired_date'                   => ['nullable', 'date'],
            'regularization_date'          => ['nullable', 'date'],
            'contract_date_from'           => ['nullable', 'date'],
            'contract_date_to'             => ['nullable', 'date', 'after_or_equal:contract_date_from'],
            'contract_status'              => ['nullable', 'string', 'max:50'],
            'employment_type'              => ['nullable', 'string', 'max:50'],
            'status'                       => ['nullable', 'string', 'max:50'],
            'company_id'                   => ['nullable', 'integer', 'exists:companies,id'],
            'branch_id'                    => ['nullable', 'integer', 'exists:company_branches,id'],
            'department_id'                => ['nullable', 'integer', 'exists:departments,id'],
            'position_id'                  => ['nullable', 'integer', 'exists:positions,id'],
            'job_level'                    => ['nullable', 'string', 'max:50'],
            'probationary_period_months'   => ['nullable', 'integer', 'min:0', 'max:24'],
            'probationary_evaluation_date' => ['nullable', 'date'],

            // ── Employee Gov Ids ────────────────────────────────────

            'sss_number'         => ['nullable', 'string', 'max:50'],
            'sss_status'         => ['nullable', 'string', 'in:no_sss,for_verification,verified'],
            'sss_remarks'        => ['nullable', 'string'],
            'pagibig_number'     => ['nullable', 'string', 'max:50'],
            'pagibig_status'     => ['nullable', 'string', 'in:no_pagibig,for_verification,verified'],
            'pagibig_remarks'    => ['nullable', 'string'],
            'philhealth_number'  => ['nullable', 'string', 'max:50'],
            'philhealth_status'  => ['nullable', 'string', 'in:no_philhealth,for_verification,verified'],
            'philhealth_remarks' => ['nullable', 'string'],
            'tin_number'         => ['nullable', 'string', 'max:50'],
            'tin_status'         => ['nullable', 'string', 'in:no_tin,for_verification,verified'],
            'tin_remarks'        => ['nullable', 'string'],

            // ── Bank Account ─────────────────────────────────────────
            'bank_name'            => ['nullable', 'string', 'max:255'],
            'account_number'       => ['nullable', 'string', 'max:255'],
            'account_name'         => ['nullable', 'string', 'max:255'],
            'atm_card_number'      => ['nullable', 'string', 'max:255'],
            'atm_status'           => ['nullable', 'string', 'in:pending,released,active,inactive'],
            'gcash_account_number' => ['nullable', 'string', 'max:255'],
            'gcash_account_name'   => ['nullable', 'string', 'max:255'],
            'other_bank_type'      => ['nullable', 'string', 'max:255'],
            'other_bank_name'      => ['nullable', 'string', 'max:255'],
            'other_account_number' => ['nullable', 'string', 'max:255'],
            'other_account_name'   => ['nullable', 'string', 'max:255'],

            // ── Compensation ──────────────────────────────────────────────
            'work_time_factor_id' => ['nullable', 'integer', 'exists:work_time_factors,id'],
            'monthly_rate'   => ['nullable', 'numeric', 'min:0'],
            'daily_rate'     => ['nullable', 'numeric', 'min:0'],
            'hourly_rate'    => ['nullable', 'numeric', 'min:0'],
            'payroll_type'   => ['nullable', Rule::in(['monthly', 'semi_monthly', 'weekly', 'daily', 'hourly'])],
            'salary_type'    => ['nullable', Rule::in(['hourly_rate', 'daily_rate', 'weekly_rate', 'semi_monthly_rate', 'monthly_rate'])],
            'effective_date' => ['nullable', 'date'],
            'is_current'     => ['nullable', 'boolean'],

            'employee_earnings'                    => ['nullable', 'array'],
            'employee_earnings.*.earning_id'       => ['required', 'integer', 'exists:earnings,id'],
            'employee_earnings.*.amount'           => ['required', 'numeric', 'min:0'],
            'employee_earnings.*.frequency'        => ['nullable', 'string', 'in:one-time,daily,weekly,bi-weekly,semi-monthly,monthly'],
            'employee_earnings.*.is_continuous'    => ['boolean'],
            'employee_earnings.*.effective_date'   => ['nullable', 'date'],
            'employee_earnings.*.end_date'         => ['nullable', 'date', 'after_or_equal:employee_earnings.*.effective_date'],

            // ── Work Experience ───────────────────────────────────────
            'work_experiences'                       => ['nullable', 'array'],
            'work_experiences.*.company_name'        => ['nullable', 'string', 'max:255'],
            'work_experiences.*.position'            => ['nullable', 'string', 'max:255'],
            'work_experiences.*.department'          => ['nullable', 'string', 'max:255'],
            'work_experiences.*.start_date'          => ['nullable', 'date'],
            'work_experiences.*.end_date'            => ['nullable', 'date', 'after_or_equal:work_experiences.*.start_date'],
            'work_experiences.*.years_of_service'    => ['nullable', 'numeric', 'min:0'],
            'work_experiences.*.remarks'             => ['nullable', 'string'],

            // ── Emergency Contacts ────────────────────────────────────
            'emergency_contacts'                              => ['nullable', 'array'],
            'emergency_contacts.*.contact_person_name'        => ['nullable', 'string', 'max:255'],
            'emergency_contacts.*.contact_person_relationship'=> ['nullable', 'string', 'max:100'],
            'emergency_contacts.*.contact_person_phone'       => ['nullable', 'string', 'max:20'],
            'emergency_contacts.*.contact_person_telephone'   => ['nullable', 'string', 'max:20'],
            'emergency_contacts.*.contact_person_address'     => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            // Employee
            'employee_number.required' => 'Employee number is required.',
            'employee_number.unique'   => 'This employee number is already taken.',
            'first_name.required'      => 'First name is required.',
            'last_name.required'       => 'Last name is required.',

            // Personal Info
            'gender.in'              => 'Gender must be Male or Female.',
            'civil_status.in'        => 'Invalid civil status.',
            'email.email'            => 'Please enter a valid email.',
            'alternate_email.email'  => 'Please enter a valid alternate email.',
            'age.integer'            => 'Age must be a whole number.',
            'birth_date.date'        => 'Please enter a valid date.',

            // Employment Details
            'hired_date.date'                    => 'Please enter a valid hired date.',
            'regularization_date.date'           => 'Please enter a valid regularization date.',
            'contract_date_from.date'            => 'Please enter a valid contract start date.',
            'contract_date_to.date'              => 'Please enter a valid contract end date.',
            'contract_date_to.after_or_equal'    => 'Contract end date must be on or after the start date.',
            'company_id.exists'                  => 'Selected company is invalid.',
            'branch_id.exists'                   => 'Selected branch is invalid.',
            'department_id.exists'               => 'Selected department is invalid.',
            'position_id.exists'                 => 'Selected position is invalid.',
            'probationary_period_months.integer' => 'Probationary period must be a whole number of months.',
            'probationary_evaluation_date.date'  => 'Please enter a valid probationary evaluation date.',

            //Employee Gov Ids
            'sss_number.string'          => 'SSS number must be a valid string.',
            'sss_status.in'              => 'Invalid SSS status.',
            'pagibig_number.string'      => 'Pag-IBIG number must be a valid string.',
            'pagibig_status.in'          => 'Invalid Pag-IBIG status.',
            'philhealth_number.string'   => 'PhilHealth number must be a valid string.',
            'philhealth_status.in'       => 'Invalid PhilHealth status.',
            'tin_number.string'          => 'TIN must be a valid string.',
            'tin_status.in'              => 'Invalid TIN status.',

            // Bank Account
            'atm_status.in' => 'Invalid ATM status.',

            // Compensation
            'work_time_factor_id.exists' => 'Selected work time factor is invalid.',
            'monthly_rate.numeric'  => 'Monthly rate must be a valid number.',
            'daily_rate.numeric'    => 'Daily rate must be a valid number.',
            'hourly_rate.numeric'   => 'Hourly rate must be a valid number.',
            'payroll_type.in'       => 'Invalid payroll type.',
            'salary_type.in'        => 'Invalid salary type.',
            'effective_date.date'   => 'Please enter a valid effective date.',

            // Work Experience
            'work_experiences.array'                        => 'Work experiences must be an array.',
            'work_experiences.*.company_name.string'        => 'Company name must be a valid string.',
            'work_experiences.*.position.string'            => 'Position must be a valid string.',
            'work_experiences.*.department.string'          => 'Department must be a valid string.',
            'work_experiences.*.start_date.date'            => 'Please enter a valid start date.',
            'work_experiences.*.end_date.date'              => 'Please enter a valid end date.',
            'work_experiences.*.end_date.after_or_equal'    => 'End date must be on or after the start date.',
            'work_experiences.*.years_of_service.numeric'   => 'Years of service must be a valid number.',

            // Emergency Contacts
            'emergency_contacts.array'                               => 'Emergency contacts must be an array.',
            'emergency_contacts.*.contact_person_name.string'        => 'Contact person name must be a valid string.',
            'emergency_contacts.*.contact_person_relationship.string'=> 'Relationship must be a valid string.',
            'emergency_contacts.*.contact_person_phone.string'       => 'Contact phone must be a valid string.',
            'emergency_contacts.*.contact_person_telephone.string'   => 'Contact telephone must be a valid string.',
            'emergency_contacts.*.contact_person_address.string'     => 'Contact address must be a valid string.',
            
        ];
    }
}