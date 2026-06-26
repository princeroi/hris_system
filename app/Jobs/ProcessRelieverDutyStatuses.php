<?php

namespace App\Jobs;

use App\Models\RelieverDuty;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessRelieverDutyStatuses implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $backoff = 60;

    public function handle(): void
    {
        $updated = 0;
        $skipped = 0;
        $failed  = 0;

        Log::info('[RelieverDutyJob] Starting — updating statuses for ' . now()->toDateString());

        // Only process duties that haven't been fully processed yet (not completed).
        // Once a duty reaches "completed" the job marks is_processed = true
        // and never touches it again — same pattern as ProcessScheduledReassignments.
        RelieverDuty::where('is_processed', false)
            ->whereNotNull('dates')
            ->chunkById(100, function ($chunk) use (&$updated, &$skipped, &$failed) {
                foreach ($chunk as $duty) {
                    try {
                        $correct = $duty->computeStatus();

                        if ($duty->status === $correct && $correct !== 'completed') {
                            $skipped++;
                            continue;
                        }

                        $isProcessed = $correct === 'completed';

                        $duty->update([
                            'status'       => $correct,
                            'is_processed' => $isProcessed,
                            'processed_at' => $isProcessed ? now() : null,
                        ]);

                        $updated++;

                        Log::info("[RelieverDutyJob] Updated duty #{$duty->id} | {$duty->status} → {$correct}" . ($isProcessed ? ' (marked processed)' : ''));

                    } catch (\Throwable $e) {
                        $failed++;
                        Log::error("[RelieverDutyJob] Failed duty #{$duty->id} | Error: {$e->getMessage()}");
                    }
                }
            });

        Log::info("[RelieverDutyJob] Completed | Updated: {$updated} | Skipped: {$skipped} | Failed: {$failed}");
    }
}