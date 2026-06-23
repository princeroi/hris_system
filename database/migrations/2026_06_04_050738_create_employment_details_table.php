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
        Schema::create('employment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('hired_date')->nullable();
            $table->date('regularization_date')->nullable();

            $table->date('contract_date_from')->nullable();
            $table->date('contract_date_to')->nullable();
            $table->string('contract_status')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('status')->nullable();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('set null');
            $table->foreignId('branch_id')->nullable()->constrained('company_branches')->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->string('job_level')->nullable();

            $table->integer('probationary_period_months')->nullable();
            $table->date('probationary_evaluation_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employment_details');
    }
};
