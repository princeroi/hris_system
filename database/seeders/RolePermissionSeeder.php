<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Permissions for User model ───────────────────────────
        $permissions = [
            'view user',
            'create user',
            'edit user',
            'delete user',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ─── Roles ────────────────────────────────────────────────
        $roles = [
            'super-admin',
            'hr-admin',
            'hr-recruiter',
            'hr-supervisor',
            'hr-manager',
            'payroll-specialist',
            'payroll-manager',
            'finance',
            'finance-manager',
            'operations-specialist',
            'operations-manager',
            'supervisor',
            'team-leader',
            'site-coordinator',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // ─── Assign permissions to roles ──────────────────────────

        // super-admin gets everything
        Role::findByName('super-admin')->syncPermissions(Permission::all());

        // hr-admin can do everything except delete
        Role::findByName('hr-admin')->syncPermissions([
            'view user',
            'create user',
            'edit user',
        ]);

        // hr-manager can view, create, edit
        Role::findByName('hr-manager')->syncPermissions([
            'view user',
            'create user',
            'edit user',
        ]);

        // hr-supervisor can view and edit
        Role::findByName('hr-supervisor')->syncPermissions([
            'view user',
            'edit user',
        ]);

        // hr-recruiter can view and create
        Role::findByName('hr-recruiter')->syncPermissions([
            'view user',
            'create user',
        ]);

        // the rest can only view
        $viewOnlyRoles = [
            'payroll-specialist',
            'payroll-manager',
            'finance',
            'finance-manager',
            'operations-specialist',
            'operations-manager',
            'supervisor',
            'team-leader',
            'site-coordinator',
        ];

        foreach ($viewOnlyRoles as $role) {
            Role::findByName($role)->syncPermissions(['view user']);
        }

        // ─── Assign super-admin to User ID 1 ─────────────────────
        User::find(1)?->assignRole('super-admin');
    }
}