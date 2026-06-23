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
            $table->string('sss_status')->default('for_verification');
            $table->text('sss_remarks')->nullable();

            $table->string('pagibig_number')->nullable();
            $table->string('pagibig_status')->default('for_verification');
            $table->text('pagibig_remarks')->nullable();

            $table->string('philhealth_number')->nullable();
            $table->string('philhealth_status')->default('for_verification');
            $table->text('philhealth_remarks')->nullable();

            $table->string('tin_number')->nullable();
            $table->string('tin_status')->default('for_verification');
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
