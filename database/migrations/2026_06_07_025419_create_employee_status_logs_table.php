<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');

            $table->enum('previous_status', [
                'active',
                'inactive',
                'on_leave',
                'terminated',
                'resigned',
                'retired',
            ])->nullable();

            $table->enum('new_status', [
                'active',
                'inactive',
                'on_leave',
                'terminated',
                'resigned',
                'retired',
            ]);

            $table->date('effective_date');
            $table->date('last_working_date')->nullable();
            $table->text('reason')->nullable();

            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_status_logs');
    }
};