<?php

namespace App\Jobs;

use App\Models\EmployeeCompensationLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessScheduledCompensationChanges implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $backoff = 60;

    public function handle(): void
    {
        $processed = 0;
        $failed    = 0;
        $skipped   = 0;

        Log::info('[CompensationJob] Starting — checking all unprocessed compensation changes on or before today (' . now()->toDateString() . ').');

        EmployeeCompensationLog::with('employee.compensation')
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString())
            ->orderBy('effective_date')
            ->chunkById(100, function ($chunk) use (&$processed, &$failed, &$skipped) {

                foreach ($chunk as $log) {

                    Log::info("[CompensationJob] Checking log #{$log->id} | effective_date: {$log->effective_date} | is_processed: " . ($log->is_processed ? 'true' : 'false'));

                    try {
                        DB::transaction(function () use ($log, &$skipped) {
                            $employee = $log->employee;

                            if (! $employee) {
                                Log::warning("[CompensationJob] Skipping log #{$log->id}: employee not found.");
                                $skipped++;
                                return;
                            }

                            $updates = array_filter([
                                'work_time_factor_id' => $log->new_work_time_factor_id,
                                'monthly_rate'        => $log->new_monthly_rate,
                                'daily_rate'          => $log->new_daily_rate,
                                'hourly_rate'         => $log->new_hourly_rate,
                                'payroll_type'        => $log->new_payroll_type,
                                'salary_type'         => $log->new_salary_type,
                            ], fn($v) => !is_null($v));

                            if (empty($updates)) {
                                Log::warning("[CompensationJob] Skipping log #{$log->id}: no fields to update.");
                                $skipped++;
                                return;
                            }

                            $employee->compensation()->updateOrCreate(
                                ['employee_id' => $employee->id],
                                $updates
                            );

                            $log->update([
                                'is_processed' => true,
                                'processed_at' => now(),
                            ]);
                        });

                        $processed++;
                        Log::info("[CompensationJob] Successfully processed log #{$log->id} | employee #{$log->employee_id} | effective_date: {$log->effective_date}");

                    } catch (\Throwable $e) {
                        $failed++;
                        Log::error("[CompensationJob] Failed log #{$log->id} | Error: {$e->getMessage()} | Trace: {$e->getTraceAsString()}");
                    }
                }
            });

        Log::info("[CompensationJob] Completed | Processed: {$processed} | Failed: {$failed} | Skipped: {$skipped}.");
    }
}