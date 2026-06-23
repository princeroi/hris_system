<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\CompanyBranch;
use Illuminate\Http\RedirectResponse;

class CompanyBranchesController extends Controller
{
    public function store(Request $request, Company $company): RedirectResponse
    {
        $data = $request->validate([
            'branch_name'            => ['required', 'string', 'max:255'],
            'branch_location'        => ['nullable', 'string', 'max:255'],
            'branch_contact_person'  => ['nullable', 'string', 'max:255'],
            'branch_contact_number'  => ['nullable', 'string', 'max:50'],
        ]);
    
        $company->branches()->create($data);
    
        return back()->with('success', 'Branch added.');
    }
    
    public function update(Request $request, Company $company, CompanyBranch $branch): RedirectResponse
    {
        $data = $request->validate([
            'branch_name'            => ['required', 'string', 'max:255'],
            'branch_location'        => ['nullable', 'string', 'max:255'],
            'branch_contact_person'  => ['nullable', 'string', 'max:255'],
            'branch_contact_number'  => ['nullable', 'string', 'max:50'],
        ]);
    
        $branch->update($data);
    
        return back()->with('success', 'Branch updated.');
    }
    
    public function destroy(Company $company, CompanyBranch $branch): RedirectResponse
    {
        $branch->delete();
    
        return back()->with('success', 'Branch deleted.');
    }
}
