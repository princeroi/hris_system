<?php

namespace App\Jobs;
 
use App\Models\EmployeeReassignmentLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
 
class ProcessScheduledReassignments implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
 
    public int $tries   = 3;
    public int $backoff = 60;
 
    public function handle(): void
    {
        $processed = 0;
        $failed    = 0;
        $skipped   = 0;

        Log::info('[ReassignJob] Starting — checking all unprocessed reassignments on or before today (' . now()->toDateString() . ').');

        EmployeeReassignmentLog::with('employee.employmentDetails')
            ->where('is_processed', false)
            ->whereDate('effective_date', '<=', now()->toDateString())
            ->orderBy('effective_date')
            ->chunkById(100, function ($chunk) use (&$processed, &$failed, &$skipped) {

                foreach ($chunk as $log) {

                    Log::info("[ReassignJob] Checking log #{$log->id} | effective_date: {$log->effective_date} | is_processed: " . ($log->is_processed ? 'true' : 'false'));

                    try {
                        DB::transaction(function () use ($log, &$skipped) {
                            $employee = $log->employee;

                            if (! $employee) {
                                Log::warning("[ReassignJob] Skipping log #{$log->id}: employee not found.");
                                $skipped++;
                                return;
                            }

                            if (! $employee->employmentDetails) {
                                Log::warning("[ReassignJob] Skipping log #{$log->id}: employment details missing for employee #{$employee->id}.");
                                $skipped++;
                                return;
                            }

                            $candidates = [
                                'company_id'                   => $log->new_company_id,
                                'branch_id'                    => $log->new_branch_id,
                                'department_id'                => $log->new_department_id,
                                'position_id'                  => $log->new_position_id,
                                'employment_type'              => $log->new_employment_type,
                                'contract_status'              => $log->new_contract_status,
                                'contract_date_from'           => $log->new_contract_date_from,
                                'contract_date_to'             => $log->new_contract_date_to,
                                'regularization_date'          => $log->new_regularization_date,
                                'probationary_period_months'   => $log->new_probationary_period_months,
                                'probationary_evaluation_date' => $log->new_probationary_evaluation_date,
                            ];

                            $updates = array_filter($candidates, fn($v) => !is_null($v));

                            if (empty($updates)) {
                                Log::warning("[ReassignJob] Skipping log #{$log->id}: no fields to update.");
                                $skipped++;
                                return;
                            }

                            $employee->employmentDetails()->update($updates);

                            $log->update([
                                'is_processed' => true,
                                'processed_at' => now(),
                            ]);
                        });

                        $processed++;
                        Log::info("[ReassignJob] Successfully processed log #{$log->id} | employee #{$log->employee_id} | effective_date: {$log->effective_date}");

                    } catch (\Throwable $e) {
                        $failed++;
                        Log::error("[ReassignJob] Failed log #{$log->id} | effective_date: {$log->effective_date} | Error: {$e->getMessage()} | Trace: {$e->getTraceAsString()}");
                    }
                }
            });

        Log::info("[ReassignJob] Completed | Processed: {$processed} | Failed: {$failed} | Skipped: {$skipped}.");
    }
}