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

            // ── Previous values ────────────────────────────────────────────────
            $table->foreignId('prev_company_id')->nullable()->constrained('companies')->onDelete('set null');
            $table->foreignId('prev_branch_id')->nullable()->constrained('company_branches')->onDelete('set null');
            $table->foreignId('prev_department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('prev_position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->string('prev_employment_type')->nullable();
            $table->string('prev_contract_status')->nullable();
            $table->date('prev_contract_date_from')->nullable();
            $table->date('prev_contract_date_to')->nullable();
            $table->date('prev_regularization_date')->nullable();
            $table->integer('prev_probationary_period_months')->nullable();
            $table->date('prev_probationary_evaluation_date')->nullable();

            // ── New values ─────────────────────────────────────────────────────
            $table->foreignId('new_company_id')->nullable()->constrained('companies')->onDelete('set null');
            $table->foreignId('new_branch_id')->nullable()->constrained('company_branches')->onDelete('set null');
            $table->foreignId('new_department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('new_position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->string('new_employment_type')->nullable();
            $table->string('new_contract_status')->nullable();
            $table->date('new_contract_date_from')->nullable();
            $table->date('new_contract_date_to')->nullable();
            $table->date('new_regularization_date')->nullable();
            $table->integer('new_probationary_period_months')->nullable();
            $table->date('new_probationary_evaluation_date')->nullable();

            // ── Meta ───────────────────────────────────────────────────────────
            $table->date('effective_date');
            $table->text('reason')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_processed')->default(false);
            $table->timestamp('processed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_reassignment_logs');
    }
};