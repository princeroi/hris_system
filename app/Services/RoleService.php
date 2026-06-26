<?php

namespace App\Services;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Pagination\LengthAwarePaginator;

class RoleService
{
    public function getPaginatedRoles(): LengthAwarePaginator
    {
        return Role::with('permissions')->paginate(10);
    }

    public function createRole(array $data): Role
    {
        $role = Role::create(['name' => $data['name']]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    public function updateRole(Role $role, array $data): Role
    {
        $role->update(['name' => $data['name']]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    public function deleteRole(Role $role): void
    {
        $role->delete();
    }

    public function getAllPermissions()
    {
        return Permission::all(['id', 'name']);
    }
}