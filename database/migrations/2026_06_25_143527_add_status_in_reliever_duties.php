<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reliever_duties', function (Blueprint $table) {
            $table->enum('status', ['scheduled', 'ongoing', 'completed'])
                  ->default('scheduled')
                  ->after('dates');
        });
    }

    public function down(): void
    {
        Schema::table('reliever_duties', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};