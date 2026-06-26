<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\ProcessScheduledStatusChanges;
use App\Jobs\ProcessScheduledReassignments;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\ProcessScheduledCompensationChanges;
use App\Jobs\ProcessScheduledEarningsChanges;
use App\Jobs\ProcessRelieverDutyStatuses;

Schedule::job(new ProcessScheduledStatusChanges)
    ->dailyAt('00:05')
    ->withoutOverlapping();

Schedule::job(new ProcessScheduledReassignments)
    ->dailyAt('00:05')
    ->withoutOverlapping();

Schedule::job(new ProcessScheduledCompensationChanges)
    ->dailyAt('00:05')
    ->withoutOverlapping();

Schedule::job(new ProcessScheduledEarningsChanges)
    ->dailyAt('00:05')
    ->withoutOverlapping();

Schedule::job(new ProcessRelieverDutyStatuses)
    ->dailyAt('00:05')
    ->withoutOverlapping();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');