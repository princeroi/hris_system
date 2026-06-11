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
        Schema::create('work_time_factors', function (Blueprint $table) {
            $table->id();

            $table->string('factor_name')->unique();
            $table->text('factor_description')->nullable();

            $table->decimal('working_days_per_week', 6, 2)->default(5.00)->nullable();
            $table->decimal('working_hours_per_day', 6, 2)->default(8.00)->nullable();
            $table->decimal('working_hours_per_week', 6, 2)->default(40.00)->nullable();

            $table->decimal('working_days_per_year', 6, 2)->default(260.00)->nullable();
            $table->decimal('working_hours_per_year', 7, 2)->default(2080.00)->nullable();
            $table->decimal('working_days_per_month', 6, 2)->default(21.67)->nullable();
            $table->decimal('working_hours_per_month', 7, 2)->default(176.00)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_time_factors');
    }
};
