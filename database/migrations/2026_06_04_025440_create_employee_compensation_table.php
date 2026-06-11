<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employee_compensation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->decimal('monthly_rate', 15, 2)->nullable();
            $table->decimal('daily_rate', 15, 2)->nullable();
            $table->decimal('hourly_rate', 15, 2)->nullable();

            $table->enum('payroll_type', [
                'monthly',
                'semi_monthly',
                'weekly',
                'daily',
                'hourly'
            ])->nullable();

            $table->enum('salary_type', [
                'hourly_rate',
                'daily_rate',
                'weekly_rate',
                'semi_monthly_rate',
                'monthly_rate',
            ])->nullable();
            $table->date('effective_date')->nullable();

            $table->boolean('is_current')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_compensation');
    }
};
