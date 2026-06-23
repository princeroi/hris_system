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
        $pending = EmployeeReassignmentLog::with('employee.employmentDetails')
            ->pendingToday()
            ->get();
 
        if ($pending->isEmpty()) {
            Log::info('[ReassignJob] No pending reassignments to process.');
            return;
        }
 
        Log::info("[ReassignJob] Processing {$pending->count()} pending reassignment(s).");
 
        foreach ($pending as $log) {
            try {
                DB::transaction(function () use ($log) {
                    $employee = $log->employee;
 
                    if (! $employee || ! $employee->employmentDetails) {
                        Log::warning("[ReassignJob] Skipping log #{$log->id}: employee or details missing.");
                        return;
                    }
 
                    $candidates = [
                        'company_id'                    => $log->new_company_id,
                        'branch_id'                     => $log->new_branch_id,
                        'department_id'                 => $log->new_department_id,
                        'position_id'                   => $log->new_position_id,
                        'employment_type'               => $log->new_employment_type,
                        'contract_status'               => $log->new_contract_status,
                        'contract_date_from'            => $log->new_contract_date_from,
                        'contract_date_to'              => $log->new_contract_date_to,
                        'regularization_date'           => $log->new_regularization_date,
                        'probationary_period_months'    => $log->new_probationary_period_months,
                        'probationary_evaluation_date'  => $log->new_probationary_evaluation_date,
                    ];
 
                    // Only apply fields that were explicitly set (non-null)
                    $updates = array_filter($candidates, fn($v) => !is_null($v));
 
                    if (!empty($updates)) {
                        $employee->employmentDetails()->update($updates);
                    }
 
                    $log->update([
                        'is_processed' => true,
                        'processed_at' => now(),
                    ]);
 
                    Log::info("[ReassignJob] Applied log #{$log->id}: employee #{$employee->id} reassigned.");
                });
            } catch (\Throwable $e) {
                Log::error("[ReassignJob] Failed log #{$log->id}: {$e->getMessage()}");
            }
        }
    }
}