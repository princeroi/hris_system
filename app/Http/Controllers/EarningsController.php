<?php

namespace App\Http\Controllers;

use App\Models\Earning;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EarningsController extends Controller
{
    public function index(): Response
    {
        $earnings = Earning::orderBy('name')->get();

        return Inertia::render('Earnings/Index', [
            'earnings' => $earnings,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'           => ['required', 'string', 'max:255', 'unique:earnings,name'],
            'default_amount' => ['required', 'numeric', 'min:0'],
            'code'           => ['nullable', 'string', 'max:255', 'unique:earnings,code'],
            'description'    => ['nullable', 'string'],
            'is_active'      => ['boolean'],
        ]);

        Earning::create($data);

        return redirect()->route('earnings.index')
            ->with('success', 'Earning created.');
    }

    public function update(Request $request, Earning $earning): RedirectResponse
    {
        $data = $request->validate([
            'name'           => ['required', 'string', 'max:255', "unique:earnings,name,{$earning->id}"],
            'default_amount' => ['required', 'numeric', 'min:0'],
            'code'           => ['nullable', 'string', 'max:255', "unique:earnings,code,{$earning->id}"],
            'description'    => ['nullable', 'string'],
            'is_active'      => ['boolean'],
        ]);

        $earning->update($data);

        return redirect()->route('earnings.index')
            ->with('success', 'Earning updated.');
    }

    public function destroy(Earning $earning): RedirectResponse
    {
        $earning->delete();

        return redirect()->route('earnings.index')
            ->with('success', 'Earning deleted.');
    }
}