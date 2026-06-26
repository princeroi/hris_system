<?php

namespace App\Services;

use App\Models\RelieverDuty;
use Illuminate\Support\Collection;

class RelieverDutyService
{
    private function withRelations()
    {
        return RelieverDuty::with([
            'reliever',
            'coveredEmployee',
            'company',
            'branch',
            'department',
            'position',
        ]);
    }

    public function all(): Collection
    {
        return $this->withRelations()->latest()->get();
    }

    public function find(int $id): RelieverDuty
    {
        return $this->withRelations()->findOrFail($id);
    }

    public function create(array $data): RelieverDuty
    {
        return RelieverDuty::create($this->payload($data));
    }

    public function update(RelieverDuty $duty, array $data): RelieverDuty
    {
        $duty->update($this->payload($data));

        return $duty->fresh(['reliever', 'coveredEmployee', 'company', 'branch', 'department', 'position']);
    }

    public function delete(RelieverDuty $duty): bool
    {
        return $duty->delete();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function payload(array $data): array
    {
        $dates = $data['dates'] ?? [];
        sort($dates);

        $today  = now()->toDateString();
        $min    = count($dates) ? min($dates) : null;
        $max    = count($dates) ? max($dates) : null;

        if (!$min) {
            $status = 'scheduled';
        } elseif ($min > $today) {
            $status = 'scheduled';
        } elseif ($max >= $today) {
            $status = 'ongoing';
        } else {
            $status = 'completed';
        }

        // A duty is considered "processed" when its final status (completed)
        // has been reached and confirmed — unprocessed means the job still
        // needs to transition it from scheduled → ongoing → completed over time.
        $isProcessed = $status === 'completed';

        return [
            'reliever_employee_id' => $data['reliever_employee_id'],
            'duty_type'            => $data['duty_type'],
            'covered_employee_id'  => $data['duty_type'] === 'cover_up'
                                        ? ($data['covered_employee_id'] ?? null)
                                        : null,
            'company_id'           => $data['company_id']    ?? null,
            'branch_id'            => $data['branch_id']     ?? null,
            'department_id'        => $data['department_id'] ?? null,
            'position_id'          => $data['position_id']   ?? null,
            'dates'                => $dates,
            'status'               => $status,
            'is_processed'         => $isProcessed,
            'processed_at'         => $isProcessed ? now() : null,
            'remarks'              => $data['remarks'] ?? null,
        ];
    }
}