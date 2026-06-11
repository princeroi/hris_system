<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_reassignment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');

            // Previous values
            $table->foreignId('prev_company_id')->nullable()->constrained('companies')->onDelete('set null');
            $table->foreignId('prev_branch_id')->nullable()->constrained('company_branches')->onDelete('set null');
            $table->foreignId('prev_department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('prev_position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->string('prev_employment_type')->nullable();
            $table->string('prev_job_level')->nullable();

            // New values
            $table->foreignId('new_company_id')->nullable()->constrained('companies')->onDelete('set null');
            $table->foreignId('new_branch_id')->nullable()->constrained('company_branches')->onDelete('set null');
            $table->foreignId('new_department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('new_position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->string('new_employment_type')->nullable();
            $table->string('new_job_level')->nullable();

            $table->date('effective_date');
            $table->text('reason')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_reassignment_logs');
    }
};