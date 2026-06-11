<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reliever_duties', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date']);
            // Stores sorted array of YYYY-MM-DD strings, e.g. ["2024-06-02","2024-06-03","2024-06-05"]
            $table->json('dates')->after('position_id');
        });
    }

    public function down(): void
    {
        Schema::table('reliever_duties', function (Blueprint $table) {
            $table->dropColumn('dates');
            $table->date('start_date')->after('position_id');
            $table->date('end_date')->nullable()->after('start_date');
        });
    }
};