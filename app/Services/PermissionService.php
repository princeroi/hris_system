<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;
use Illuminate\Pagination\LengthAwarePaginator;

class PermissionService
{
    public function getPaginatedPermissions(): LengthAwarePaginator
    {
        return Permission::paginate(10);
    }

    public function createPermission(array $data): Permission
    {
        return Permission::create(['name' => $data['name']]);
    }

    public function updatePermission(Permission $permission, array $data): Permission
    {
        $permission->update(['name' => $data['name']]);
        return $permission;
    }

    public function deletePermission(Permission $permission): void
    {
        $permission->delete();
    }
}