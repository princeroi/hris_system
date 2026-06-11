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
        Schema::create('employee_gov_ids', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');

            $table->string('sss_number')->nullable();
            $table->enum('sss_status', ['no_sss', 'for_verification', 'verified'])->default('for_verification');
            $table->text('sss_remarks')->nullable();

            $table->string('pagibig_number')->nullable();
            $table->enum('pagibig_status', ['no_pagibig', 'for_verification', 'verified'])->default('for_verification');
            $table->text('pagibig_remarks')->nullable();

            $table->string('philhealth_number')->nullable();
            $table->enum('philhealth_status', ['no_philhealth', 'for_verification', 'verified'])->default('for_verification');
            $table->text('philhealth_remarks')->nullable();

            $table->string('tin_number')->nullable();
            $table->enum('tin_status', ['no_tin', 'for_verification', 'verified'])->default('for_verification');
            $table->text('tin_remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_gov_ids');
    }
};
