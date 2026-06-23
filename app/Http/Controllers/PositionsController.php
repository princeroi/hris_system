<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PositionsController extends Controller
{
    public function index(): Response
    {
        $positions = Position::withCount('employmentDetail')->get();

        return Inertia::render('Positions/Index', [
            'positions' => $positions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Positions/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'position_name'        => ['required', 'string', 'max:255', 'unique:positions,position_name'],
            'position_description' => ['nullable', 'string'],
        ]);

        Position::create($data);

        return redirect()->route('positions.index')
            ->with('success', 'Position created.');
    }

    public function edit(Position $position): Response
    {
        return Inertia::render('Positions/Edit', [
            'position' => $position,
        ]);
    }

    public function update(Request $request, Position $position): RedirectResponse
    {
        $data = $request->validate([
            'position_name'        => ['required', 'string', 'max:255', "unique:positions,position_name,{$position->id}"],
            'position_description' => ['nullable', 'string'],
        ]);

        $position->update($data);

        return redirect()->route('positions.index')
            ->with('success', 'Position updated.');
    }

    public function destroy(Position $position): RedirectResponse
    {
        $position->delete();

        return redirect()->route('positions.index')
            ->with('success', 'Position deleted.');
    }
}