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
        'remarks',
    ];

    protected $casts = [
        'dates' => 'array',
    ];

    // ── Relationships ────────────────────────────────────────────────────────

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

    // ── Computed Attributes ──────────────────────────────────────────────────

    /**
     * Earliest date in the dates array.
     */
    public function getStartDateAttribute(): ?string
    {
        $dates = $this->dates ?? [];
        return count($dates) ? min($dates) : null;
    }

    /**
     * Latest date in the dates array.
     */
    public function getEndDateAttribute(): ?string
    {
        $dates = $this->dates ?? [];
        return count($dates) ? max($dates) : null;
    }

    /**
     * Derive schedule status from dates array.
     * Returns: 'scheduled' | 'ongoing' | 'completed'
     */
    public function getStatusAttribute(): string
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

    /**
     * Human-readable duty type label.
     */
    public function getDutyTypeLabelAttribute(): string
    {
        return match ($this->duty_type) {
            'vacant_post' => 'Vacant Post',
            'cover_up'    => 'Cover-Up',
            default       => ucfirst($this->duty_type),
        };
    }

    // ── Scopes ───────────────────────────────────────────────────────────────

    /**
     * Duties that contain at least one date on or after today
     * and at least one date on or before today.
     * Using JSON_CONTAINS / JSON_SEARCH is DB-specific, so we use
     * a raw expression on the serialised JSON for broad compatibility.
     *
     * For MySQL / MariaDB you can replace this with a generated column
     * index once volume demands it.
     */
    public function scopeOngoing($query)
    {
        $today = Carbon::today()->toDateString();

        return $query
            ->whereRaw("JSON_SEARCH(dates, 'one', ?) IS NOT NULL", [$today])
            // OR has a date >= today and a date <= today (spanning range with gaps)
            ->orWhere(function ($q) use ($today) {
                $q->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(dates, '$[0]')) <= ?", [$today])
                  ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(dates, '$[#-1]')) >= ?", [$today]);
            });
    }

    public function scopeScheduled($query)
    {
        $today = Carbon::today()->toDateString();
        return $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(dates, '$[0]')) > ?", [$today]);
    }

    public function scopeCompleted($query)
    {
        $today = Carbon::today()->toDateString();
        return $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(dates, '$[#-1]')) < ?", [$today]);
    }
}