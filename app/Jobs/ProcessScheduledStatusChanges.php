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
        $processed = 0;
        $failed    = 0;
        $skipped   = 0;

        Log::info('[StatusJob] Starting — checking all unprocessed status changes on or before today (' . now()->toDateString() . ').');

        EmployeeStatusLog::with('employee.employmentDetails')
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString())
            ->orderBy('effective_date')
            ->chunkById(100, function ($chunk) use (&$processed, &$failed, &$skipped) {

                foreach ($chunk as $log) {

                    Log::info("[StatusJob] Checking log #{$log->id} | type: {$log->type} | effective_date: {$log->effective_date} | is_processed: " . ($log->is_processed ? 'true' : 'false'));

                    try {
                        DB::transaction(function () use ($log, &$skipped) {
                            $employee = $log->employee;

                            if (! $employee) {
                                Log::warning("[StatusJob] Skipping log #{$log->id}: employee not found.");
                                $skipped++;
                                return;
                            }

                            if (! $employee->employmentDetails) {
                                Log::warning("[StatusJob] Skipping log #{$log->id}: employment details missing for employee #{$employee->id}.");
                                $skipped++;
                                return;
                            }

                            if (empty($log->new_status)) {
                                Log::warning("[StatusJob] Skipping log #{$log->id}: new_status is empty.");
                                $skipped++;
                                return;
                            }

                            match ($log->type) {
                                'archive' => $employee->employmentDetails()->update([
                                    'status' => $log->new_status,
                                ]),
                                'rehire' => $employee->employmentDetails()->update([
                                    'status' => $log->new_status,
                                ]),
                                'status_change' => $employee->employmentDetails()->update([
                                    'status' => $log->new_status,
                                ]),
                                default => $employee->employmentDetails()->update([
                                    'status' => $log->new_status,
                                ]),
                            };

                            $log->update([
                                'is_processed' => true,
                                'processed_at' => now(),
                            ]);
                        });

                        $processed++;
                        Log::info("[StatusJob] Successfully processed log #{$log->id} | employee #{$log->employee_id} | type: {$log->type} | effective_date: {$log->effective_date} | new_status: {$log->new_status}");

                    } catch (\Throwable $e) {
                        $failed++;
                        Log::error("[StatusJob] Failed log #{$log->id} | effective_date: {$log->effective_date} | Error: {$e->getMessage()} | Trace: {$e->getTraceAsString()}");
                    }
                }
            });

        Log::info("[StatusJob] Completed | Processed: {$processed} | Failed: {$failed} | Skipped: {$skipped}.");
    }
}