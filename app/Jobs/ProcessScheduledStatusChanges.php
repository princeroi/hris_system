<?php

namespace App\Jobs;

use App\Models\EmployeeStatusLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessScheduledStatusChanges implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $backoff = 60;

    public function handle(): void
    {
        $pending = EmployeeStatusLog::with('employee.employmentDetails')
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString())
            ->get();

        if ($pending->isEmpty()) {
            Log::info('[StatusJob] No pending status changes to process.');
            return;
        }

        Log::info("[StatusJob] Processing {$pending->count()} pending status change(s).");

        foreach ($pending as $log) {
            try {
                DB::transaction(function () use ($log) {
                    $employee = $log->employee;

                    if (! $employee || ! $employee->employmentDetails) {
                        Log::warning("[StatusJob] Skipping log #{$log->id}: employee or details missing.");
                        return;
                    }

                    $employee->employmentDetails()->update([
                        'status' => $log->new_status,
                    ]);

                    $log->update([
                        'is_processed' => true,
                        'processed_at' => now(),
                    ]);

                    Log::info("[StatusJob] Applied log #{$log->id}: employee #{$employee->id} → {$log->new_status}");
                });
            } catch (\Throwable $e) {
                Log::error("[StatusJob] Failed log #{$log->id}: {$e->getMessage()}");
            }
        }
    }
}