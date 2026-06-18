<?php
// database/migrations/xxxx_add_applied_at_to_employee_status_logs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_status_logs', function (Blueprint $table) {
            // null = pending (future effective_date), filled = already applied
            $table->string('type')->default('archive')->after('employee_id');
            $table->timestamp('applied_at')->nullable()->after('changed_by');
        });
    }

    public function down(): void
    {
        Schema::table('employee_status_logs', function (Blueprint $table) {
            $table->dropColumn('applied_at');
            $table->dropColumn('type');
        });
    }
};