<?php
// app/Models/EmployeeOption.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeOption extends Model
{
    protected $table = 'options';
    protected $fillable = ['group_id', 'value'];

    public function group(): BelongsTo
    {
        return $this->belongsTo(EmployeeOptionGroup::class, 'group_id');
    }
}