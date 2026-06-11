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
        Schema::table('employee_compensation', function (Blueprint $table) {
            $table->foreignId('work_time_factor_id')->nullable()->after('employee_id')->constrained('work_time_factors')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_compensation', function (Blueprint $table) {
            $table->dropForeign(['work_time_factor_id']);
            $table->dropColumn('work_time_factor_id');
        });
    }
};
