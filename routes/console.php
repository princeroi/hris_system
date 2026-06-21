<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\ProcessScheduledStatusChanges;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new ProcessScheduledStatusChanges)
    ->dailyAt('00:05')
    ->withoutOverlapping()
    ->runInBackground();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');