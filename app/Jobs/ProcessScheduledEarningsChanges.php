<?php

namespace App\Jobs;

use App\Models\EmployeeEarningLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessScheduledEarningsChanges implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $backoff = 60;

    public function handle(): void
    {
        $processed = 0;
        $failed    = 0;
        $skipped   = 0;

        Log::info('[EarningsJob] Starting — checking all unprocessed earnings changes on or before today (' . now()->toDateString() . ').');

        EmployeeEarningLog::with('employee.employeeEarnings')
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString())
            ->orderBy('effective_date')
            ->chunkById(100, function ($chunk) use (&$processed, &$failed, &$skipped) {

                foreach ($chunk as $log) {

                    Log::info("[EarningsJob] Checking log #{$log->id} | action: {$log->action} | earning_id: {$log->earning_id} | effective_date: {$log->effective_date}");

                    try {
                        DB::transaction(function () use ($log, &$skipped) {
                            $employee = $log->employee;

                            if (! $employee) {
                                Log::warning("[EarningsJob] Skipping log #{$log->id}: employee not found.");
                                $skipped++;
                                return;
                            }

                            match ($log->action) {
                                'added' => $employee->employeeEarnings()->firstOrCreate(
                                    ['earning_id' => $log->earning_id],
                                    [
                                        'amount'    => $log->new_amount,
                                        'frequency' => $log->new_frequency ?? 'monthly',
                                    ]
                                ),

                                'updated' => $employee->employeeEarnings()
                                    ->where('earning_id', $log->earning_id)
                                    ->update([
                                        'amount'    => $log->new_amount,
                                        'frequency' => $log->new_frequency ?? 'monthly',
                                    ]),

                                'removed' => $employee->employeeEarnings()
                                    ->where('earning_id', $log->earning_id)
                                    ->delete(),

                                default => null,
                            };

                            $log->update([
                                'is_processed' => true,
                                'processed_at' => now(),
                            ]);
                        });

                        $processed++;
                        Log::info("[EarningsJob] Successfully processed log #{$log->id} | action: {$log->action} | employee #{$log->employee_id}");

                    } catch (\Throwable $e) {
                        $failed++;
                        Log::error("[EarningsJob] Failed log #{$log->id} | Error: {$e->getMessage()} | Trace: {$e->getTraceAsString()}");
                    }
                }
            });

        Log::info("[EarningsJob] Completed | Processed: {$processed} | Failed: {$failed} | Skipped: {$skipped}.");
    }
}