<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $isPost = $this->isMethod('POST');

        return [
            'employee_id'   => ['nullable', 'exists:employees,id'],

            'name'          => ['required', 'string', 'max:255'],

            'username'      => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($userId),
            ],

            'email'         => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],

            'temp_password' => [
                $isPost ? 'required' : 'nullable',
                'string',
            ],
            'password'      => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],

            'role'          => ['required', 'string', 'exists:roles,name'],
            'is_active'     => ['boolean'],
        ];
    }
}