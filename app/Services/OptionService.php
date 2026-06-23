<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class OptionService
{
    public static function cellOptions(): array
    {
        return DB::table('option_groups')
            ->join('options', 'option_groups.id', '=', 'options.group_id')
            ->select('option_groups.group', 'options.value')
            ->get()
            ->groupBy('group')
            ->map(fn($items) => $items->pluck('value')->toArray())
            ->toArray();
    }
}