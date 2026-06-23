<?php
// app/Models/EmployeeOptionGroup.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeOptionGroup extends Model
{
    protected $table = 'option_groups';
    protected $fillable = ['group'];

    public function options(): HasMany
    {
        return $this->hasMany(EmployeeOption::class, 'group_id');
    }
    
    private function cellOptions(): array
    {
        $groups = \DB::table('option_groups')->get();
        $options = \DB::table('options')->get();

        $result = [];
        foreach ($groups as $group) {
            $result[$group->group] = $options
                ->where('group_id', $group->id)
                ->pluck('value')
                ->values()
                ->toArray();
        }

        return $result;
    }
}