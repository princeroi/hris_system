<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_earnings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('earning_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->decimal('amount', 12, 2)->default(0);

            // one-time | daily | weekly | bi-weekly | semi-monthly | monthly
            $table->string('frequency')->default('monthly');

            $table->boolean('is_continuous')->default(true);

            // only relevant when is_continuous = false
            $table->date('effective_date')->nullable();
            $table->date('end_date')->nullable();

            $table->text('remarks')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['employee_id', 'earning_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_earnings');
    }
};