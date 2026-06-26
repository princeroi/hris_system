<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reliever_duties', function (Blueprint $table) {
            $table->boolean('is_processed')->default(false)->after('status');
            $table->timestamp('processed_at')->nullable()->after('is_processed');
        });
    }

    public function down(): void
    {
        Schema::table('reliever_duties', function (Blueprint $table) {
            $table->dropColumn(['is_processed', 'processed_at']);
        });
    }
};