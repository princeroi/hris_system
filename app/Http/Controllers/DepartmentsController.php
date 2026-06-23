<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentsController extends Controller
{
    public function index(): Response
    {
        $departments = Department::withCount('employmentDetail')->get();

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
        ]);
    }

    // public function create(): Response
    // {
    //     return Inertia::render('Departments/Create');
    // }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'department_name' => ['required', 'string', 'max:255', 'unique:departments,department_name'],
        ]);

        Department::create($data);

        return redirect()->route('departments.index')
            ->with('success', 'Department created.');
    }

    // public function edit(Department $department): Response
    // {
    //     return Inertia::render('Departments/Edit', [
    //         'department' => $department,
    //     ]);
    // }

    public function update(Request $request, Department $department): RedirectResponse
    {
        $data = $request->validate([
            'department_name' => ['required', 'string', 'max:255', "unique:departments,department_name,{$department->id}"],
        ]);

        $department->update($data);

        return redirect()->route('departments.index')
            ->with('success', 'Department updated.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', 'Department deleted.');
    }
}