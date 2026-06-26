<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeStatusController;
use App\Http\Controllers\ArchiveEmployeeController;
use App\Http\Controllers\EmployeeReassignmentController;
use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\EmployeeOptionController;
use App\Http\Controllers\CompanyBranchesController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\PositionsController;
use App\Http\Controllers\EarningsController;
use App\Http\Controllers\RelieverDutyController;
use App\Http\Controllers\EmployeeCompensationController;
use App\Http\Controllers\EmployeeEarningsController;
use App\Http\Controllers\UserController;

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

    Route::post('/employees/{employee}/reassign', [EmployeeReassignmentController::class, 'store'])
        ->name('employees.reassign');

    Route::resource('companies', CompaniesController::class);
 
    Route::prefix('companies/{company}/branches')->name('companies.branches.')->group(function () {
        Route::post('/',            [CompanyBranchesController::class, 'store'])->name('store');
        Route::put('/{branch}',     [CompanyBranchesController::class, 'update'])->name('update');
        Route::delete('/{branch}',  [CompanyBranchesController::class, 'destroy'])->name('destroy');
    });

    Route::resource('options', EmployeeOptionController::class);

    Route::resource('departments', DepartmentsController::class);
    Route::resource('positions', PositionsController::class);
    Route::resource('earnings', EarningsController::class);

    Route::post('/employees/{employee}/change-compensation', [EmployeeCompensationController::class, 'store'])->name('employees.change-compensation');
    Route::post('/employees/{employee}/earnings', [EmployeeEarningsController::class, 'store'])->name('employees.manageEarnings');

    Route::resource('reliever-duties', RelieverDutyController::class);
    Route::resource('users', UserController::class);
});


require __DIR__.'/auth.php';
