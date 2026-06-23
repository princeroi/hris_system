<?php
// app/Http/Controllers/EmployeeOptionController.php

namespace App\Http\Controllers;

use App\Models\EmployeeOption;
use App\Models\EmployeeOptionGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeOptionController extends Controller
{
    // ── Index ─────────────────────────────────────────────────────────────────
    /**
     * List all option groups with their options.
     * GET /employee-options
     */
    public function index(): Response
    {
        $groups = EmployeeOptionGroup::with('options')
            ->orderBy('group')
            ->get()
            ->map(fn ($g) => [
                'id'      => $g->id,
                'group'   => $g->group,
                'options' => $g->options
                    ->sortBy('value')
                    ->values()
                    ->map(fn ($o) => [
                        'id'    => $o->id,
                        'value' => $o->value,
                    ]),
            ]);

        return Inertia::render('Options/Index', [
            'groups' => $groups,
        ]);
    }

    // ── Group: store ──────────────────────────────────────────────────────────
    /**
     * Create a new option group.
     * POST /employee-options/groups
     */
    public function storeGroup(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'group' => [
                'required',
                'string',
                'max:100',
                // group names must be unique and snake_case-friendly
                'regex:/^[a-z][a-z0-9_]*$/',
                'unique:option_groups,group',
            ],
        ], [
            'group.regex' => 'Group name must be lowercase letters, numbers, and underscores only (e.g. civil_status).',
        ]);

        EmployeeOptionGroup::create($data);

        return back()->with('success', 'Option group created.');
    }

    // ── Group: update ─────────────────────────────────────────────────────────
    /**
     * Rename an option group.
     * PUT /employee-options/groups/{group}
     */
    public function updateGroup(Request $request, EmployeeOptionGroup $group): RedirectResponse
    {
        $data = $request->validate([
            'group' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z][a-z0-9_]*$/',
                "unique:option_groups,group,{$group->id}",
            ],
        ], [
            'group.regex' => 'Group name must be lowercase letters, numbers, and underscores only (e.g. civil_status).',
        ]);

        $group->update($data);

        return back()->with('success', 'Option group updated.');
    }

    // ── Group: destroy ────────────────────────────────────────────────────────
    /**
     * Delete a group and all its options (cascade handled by DB).
     * DELETE /employee-options/groups/{group}
     */
    public function destroyGroup(EmployeeOptionGroup $group): RedirectResponse
    {
        $group->delete();

        return back()->with('success', 'Option group and all its options deleted.');
    }

    // ── Option: store ─────────────────────────────────────────────────────────
    /**
     * Add an option value to a group.
     * POST /employee-options/groups/{group}/options
     */
    public function storeOption(Request $request, EmployeeOptionGroup $group): RedirectResponse
    {
        $data = $request->validate([
            'value' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        // Prevent duplicate values within the same group (case-insensitive)
        $exists = $group->options()
            ->whereRaw('LOWER(value) = ?', [strtolower($data['value'])])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'value' => '"' . $data['value'] . '" already exists in this group.',
            ]);
        }

        $group->options()->create($data);

        return back()->with('success', 'Option added.');
    }

    // ── Option: update ────────────────────────────────────────────────────────
    /**
     * Rename an option value.
     * PUT /employee-options/options/{option}
     */
    public function updateOption(Request $request, EmployeeOption $option): RedirectResponse
    {
        $data = $request->validate([
            'value' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        // Prevent duplicate within the same group (case-insensitive), excluding self
        $exists = EmployeeOption::where('group_id', $option->group_id)
            ->where('id', '!=', $option->id)
            ->whereRaw('LOWER(value) = ?', [strtolower($data['value'])])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'value' => '"' . $data['value'] . '" already exists in this group.',
            ]);
        }

        $option->update($data);

        return back()->with('success', 'Option updated.');
    }

    // ── Option: destroy ───────────────────────────────────────────────────────
    /**
     * Delete a single option value.
     * DELETE /employee-options/options/{option}
     */
    public function destroyOption(EmployeeOption $option): RedirectResponse
    {
        $option->delete();

        return back()->with('success', 'Option deleted.');
    }

    // ── Bulk reorder options ──────────────────────────────────────────────────
    /**
     * Persist a new sort order for options within a group.
     * Expects: { ids: [1, 4, 2, 7, ...] } in the desired order.
     * PUT /employee-options/groups/{group}/reorder
     *
     * Note: requires a `sort_order` column on the options table.
     * Add via: $table->unsignedInteger('sort_order')->default(0);
     */
    public function reorderOptions(Request $request, EmployeeOptionGroup $group): RedirectResponse
    {
        $data = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:options,id'],
        ]);

        foreach ($data['ids'] as $position => $id) {
            EmployeeOption::where('id', $id)
                ->where('group_id', $group->id)   // safety: only update options in this group
                ->update(['sort_order' => $position]);
        }

        return back()->with('success', 'Order saved.');
    }
}