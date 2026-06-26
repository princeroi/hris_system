<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function getPaginatedUsers(int $perPage = 10): LengthAwarePaginator
    {
        return User::with('roles')->latest()->paginate($perPage);
    }

    public static function generateTemporaryPassword(): string
    {
        return 'Temp@' . strtoupper(Str::random(6));
    }

    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // Derive username from employee_number if not provided
            $username = $data['username'] ?? null;

            if (empty($username) && !empty($data['employee_id'])) {
                $employee = \App\Models\Employee::find($data['employee_id']);
                $username = 'ssi-' . $employee?->employee_number;
            }

            $user = User::create([
                'employee_id' => $data['employee_id'] ?? null,
                'name'        => $data['name'],
                'username'    => $username,
                'email'       => $data['email'],
                'password'    => bcrypt($data['temp_password']),
                'is_active'   => true,
            ]);

            if (!empty($data['role'])) {
                $user->assignRole($data['role']);
            }

            return $user;
        });
    }

    public function updateUser(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $payload = [
                'name'      => $data['name'],
                'username'  => $data['username'],
                'email'     => $data['email'],
                'is_active' => $data['is_active'] ?? $user->is_active,
            ];

            if (!empty($data['password'])) {
                $payload['password'] = $data['password'];
            }

            $user->update($payload);

            if (!empty($data['role'])) {
                $user->syncRoles($data['role']);
            }

            return $user->fresh('roles');
        });
    }

    public function deleteUser(User $user): void
    {
        DB::transaction(function () use ($user) {
            $user->syncRoles([]);
            $user->delete();
        });
    }
}