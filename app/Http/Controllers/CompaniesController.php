<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\CompanyBranch;
use Inertia\Inertia;
use Inertia\Response; 
use Illuminate\Http\RedirectResponse;

class CompaniesController extends Controller
{
    public function index()
    {
        $companies = Company::withCount('branches')->get();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Companies/Create');
    }
    
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:255', 'unique:companies,company_name'],
            'is_active'    => ['boolean'],
        ]);
    
        $company = Company::create($data);
    
        return redirect()->route('companies.show', $company->id)
            ->with('success', 'Company created.');
    }
    
    public function show(Company $company): Response
    {
        return Inertia::render('Companies/Show', [
            'company'  => $company,
            'branches' => $company->branches()->orderBy('branch_name')->get(),
        ]);
    }
    
    public function edit(Company $company): Response
    {
        return Inertia::render('Companies/Edit', [
            'company'  => $company,
            'branches' => $company->branches()->orderBy('branch_name')->get(),
        ]);
    }
    
    public function update(Request $request, Company $company): RedirectResponse
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:255', "unique:companies,company_name,{$company->id}"],
            'is_active'    => ['boolean'],
        ]);
    
        $company->update($data);
    
        return redirect()->route('companies.show', $company->id)
            ->with('success', 'Company updated.');
    }
    
    public function destroy(Company $company): RedirectResponse
    {
        $company->delete();
    
        return redirect()->route('companies.index')
            ->with('success', 'Company deleted.');
    }
}
