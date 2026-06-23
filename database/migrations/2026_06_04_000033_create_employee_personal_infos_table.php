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
        Schema::create('employee_personal_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->date('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->integer('age')->nullable();

            $table->string('gender')->nullable();

            $table->string('civil_status')->nullable();

            $table->string('nationality')->nullable();
            $table->string('religion')->nullable();

            $table->text('home_address')->nullable();
            $table->text('current_address')->nullable();

            $table->string('phone_number')->nullable();
            $table->string('telephone_number')->nullable();

            $table->string('email')->nullable();
            $table->string('alternate_email')->nullable();

            $table->string('highest_education')->nullable();
            $table->string('course')->nullable();
            $table->string('school')->nullable();

            $table->string('profile_picture')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_personal_infos');
    }
};
