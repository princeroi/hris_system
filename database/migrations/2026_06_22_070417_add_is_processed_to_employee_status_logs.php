<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_status_logs', function (Blueprint $table) {
            $table->boolean('is_processed')->default(false)->after('applied_at');
            $table->timestamp('processed_at')->nullable()->after('is_processed');
        });
    }

    public function down(): void
    {
        Schema::table('employee_status_logs', function (Blueprint $table) {
            $table->dropColumn(['is_processed', 'processed_at']);
        });
    }
};