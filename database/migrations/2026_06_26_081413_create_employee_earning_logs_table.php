<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_earning_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('earning_id')->constrained()->cascadeOnDelete();

            $table->string('action')->default('updated'); // added | updated | removed

            $table->decimal('prev_amount', 12, 2)->nullable();
            $table->string('prev_frequency')->nullable();

            $table->decimal('new_amount', 12, 2)->nullable();
            $table->string('new_frequency')->nullable();

            $table->date('effective_date');
            $table->string('reason', 1000)->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->boolean('is_processed')->default(false);
            $table->timestamp('processed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_earning_logs');
    }
};