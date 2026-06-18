<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeStatusController;
use App\Http\Controllers\ArchiveEmployeeController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/employees/archived', [ArchiveEmployeeController::class, 'index'])
        ->name('employees.archive_employees.index');
    Route::get('/employees/bulk-upload', [EmployeeController::class, 'bulkUpload'])->name('employees.bulk.upload');
    Route::post('/employees/bulk', [EmployeeController::class, 'bulkStore'])->name('employees.bulk.store');
    Route::resource('employees', EmployeeController::class);

    Route::patch('/employees/{employee}/status', [EmployeeStatusController::class, 'update'])
        ->name('employees.status.update');

    Route::patch('/employees/{employee}/rehire', [EmployeeStatusController::class, 'rehire'])
        ->name('employees.rehire');

});


require __DIR__.'/auth.php';
