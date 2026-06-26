<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Employee;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function index(): Response
    {
        Gate::authorize('viewAny', User::class);

        return Inertia::render('Users/Index', [
            'users' => [
                'data' => User::with('roles')
                    ->get()
                    ->map(fn($user) => [
                        'id'         => $user->id,
                        'name'       => $user->name,
                        'username'   => $user->username,
                        'email'      => $user->email,
                        'is_active'  => $user->is_active ?? true,
                        'roles'      => $user->roles->pluck('name'),
                        'created_at' => $user->created_at->format('M d, Y'),
                    ]),
            ],
        ]);
    }

    public function show(User $user): Response
    {
        Gate::authorize('view', $user);

        $user->load('roles');

        return Inertia::render('Users/Show', [
            'user' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'username'   => $user->username,
                'email'      => $user->email,
                'is_active'  => $user->is_active ?? true,
                'roles'      => $user->roles->pluck('name'),
                'created_at' => $user->created_at->format('M d, Y'),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', User::class);

        return Inertia::render('Users/Create', [
            'roles'     => Role::all(['id', 'name']),
            'employees' => Employee::with('personalInfo:employee_id,email')
                ->whereDoesntHave('user')
                ->orderBy('last_name')
                ->get(['id', 'first_name', 'last_name', 'employee_number'])
                ->map(fn($e) => [
                    'id'              => $e->id,
                    'first_name'      => $e->first_name,
                    'last_name'       => $e->last_name,
                    'employee_number' => $e->employee_number,
                    'email'           => $e->personalInfo?->email ?? '',
                ]),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        Gate::authorize('create', User::class);

        $this->userService->createUser($request->validated());

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        Gate::authorize('update', $user);

        $user->load(['roles', 'employee']);

        return Inertia::render('Users/Edit', [
            'user' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'username'   => $user->username,
                'email'      => $user->email,
                'is_active'  => $user->is_active ?? true,
                'roles'      => $user->roles->pluck('name'),
                'created_at' => $user->created_at->format('M d, Y'),
                'employee'   => $user->employee ? [
                    'first_name'      => $user->employee->first_name,
                    'last_name'       => $user->employee->last_name,
                    'employee_number' => $user->employee->employee_number,
                ] : null,
            ],
            'roles' => Role::all(['id', 'name']),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        $this->userService->updateUser($user, $request->validated());

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $this->userService->deleteUser($user);

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}