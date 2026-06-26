<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RelieverDuty extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reliever_employee_id',
        'duty_type',
        'covered_employee_id',
        'company_id',
        'branch_id',
        'department_id',
        'position_id',
        'dates',
        'status',
        'is_processed',
        'processed_at',
        'remarks',
    ];

    protected $casts = [
        'dates'        => 'array',
        'is_processed' => 'boolean',
        'processed_at' => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function reliever(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reliever_employee_id');
    }

    public function coveredEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'covered_employee_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(CompanyBranch::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    // ── Computed Attributes ───────────────────────────────────────────────────

    public function getStartDateAttribute(): ?string
    {
        $dates = $this->dates ?? [];
        return count($dates) ? min($dates) : null;
    }

    public function getEndDateAttribute(): ?string
    {
        $dates = $this->dates ?? [];
        return count($dates) ? max($dates) : null;
    }

    public function computeStatus(): string
    {
        $today = Carbon::today()->toDateString();
        $dates = $this->dates ?? [];

        if (empty($dates)) return 'scheduled';

        $min = min($dates);
        $max = max($dates);

        if ($min > $today) return 'scheduled';
        if ($max >= $today) return 'ongoing';

        return 'completed';
    }

    public function getDutyTypeLabelAttribute(): string
    {
        return match ($this->duty_type) {
            'vacant_post' => 'Vacant Post',
            'cover_up'    => 'Cover-Up',
            default       => ucfirst($this->duty_type),
        };
    }

    // ── Scopes ────────────────────────────────────────────────────────────────

    public function scopePendingToday($query)
    {
        return $query
            ->where('is_processed', false)
            ->whereNotNull('dates');
    }
}