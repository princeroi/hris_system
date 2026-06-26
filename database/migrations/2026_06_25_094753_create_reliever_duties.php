<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('reliever_duties');

        Schema::create('reliever_duties', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reliever_employee_id')
                  ->constrained('employees')
                  ->cascadeOnDelete();

            $table->enum('duty_type', ['vacant_post', 'cover_up']);

            $table->foreignId('covered_employee_id')
                  ->nullable()
                  ->constrained('employees')
                  ->nullOnDelete();

            $table->foreignId('company_id')
                  ->nullable()
                  ->constrained('companies')
                  ->nullOnDelete();

            $table->foreignId('branch_id')
                  ->nullable()
                  ->constrained('company_branches')
                  ->nullOnDelete();

            $table->foreignId('department_id')
                  ->nullable()
                  ->constrained('departments')
                  ->nullOnDelete();

            $table->foreignId('position_id')
                  ->nullable()
                  ->constrained('positions')
                  ->nullOnDelete();

            $table->json('dates');

            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reliever_duties');

        Schema::create('reliever_duties', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reliever_employee_id')
                  ->constrained('employees')
                  ->cascadeOnDelete();

            $table->enum('duty_type', ['vacant_post', 'cover_up']);

            $table->foreignId('covered_employee_id')
                  ->nullable()
                  ->constrained('employees')
                  ->nullOnDelete();

            $table->foreignId('company_id')
                  ->nullable()
                  ->constrained('companies')
                  ->nullOnDelete();

            $table->foreignId('branch_id')
                  ->nullable()
                  ->constrained('company_branches')
                  ->nullOnDelete();

            $table->foreignId('department_id')
                  ->nullable()
                  ->constrained('departments')
                  ->nullOnDelete();

            $table->foreignId('position_id')
                  ->nullable()
                  ->constrained('positions')
                  ->nullOnDelete();

            $table->date('start_date');
            $table->date('end_date')->nullable();

            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
};