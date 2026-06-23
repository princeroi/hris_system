<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('option_groups', function (Blueprint $table) {
            $table->id();
            $table->string('group'); // e.g. gender, civil_status
            $table->timestamps();
        });

        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('option_groups')->onDelete('cascade');
            $table->string('value'); // e.g. Male, Female
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('options');
        Schema::dropIfExists('option_groups');
    }
};