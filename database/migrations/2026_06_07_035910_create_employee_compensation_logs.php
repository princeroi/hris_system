<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_compensation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');

            // Previous values
            $table->foreignId('prev_work_time_factor_id')->nullable()->constrained('work_time_factors')->nullOnDelete();
            $table->decimal('prev_monthly_rate', 15, 2)->nullable();
            $table->decimal('prev_daily_rate',   15, 2)->nullable();
            $table->decimal('prev_hourly_rate',  15, 2)->nullable();
            $table->string('prev_payroll_type')->nullable();
            $table->string('prev_salary_type')->nullable();

            // New values
            $table->foreignId('new_work_time_factor_id')->nullable()->constrained('work_time_factors')->nullOnDelete();
            $table->decimal('new_monthly_rate', 15, 2)->nullable();
            $table->decimal('new_daily_rate',   15, 2)->nullable();
            $table->decimal('new_hourly_rate',  15, 2)->nullable();
            $table->string('new_payroll_type')->nullable();
            $table->string('new_salary_type')->nullable();

            $table->date('effective_date');
            $table->string('reason', 1000)->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_compensation_logs');
    }
};