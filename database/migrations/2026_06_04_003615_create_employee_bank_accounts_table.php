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
        Schema::create('employee_bank_accounts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');

            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_name')->nullable();
            $table->string('atm_card_number')->nullable();
            $table->string('atm_status')->default('active');

            $table->string('gcash_account_number')->nullable();
            $table->string('gcash_account_name')->nullable();

            $table->string('other_bank_type')->nullable();
            $table->string('other_bank_name')->nullable();
            $table->string('other_account_number')->nullable();
            $table->string('other_account_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_bank_accounts');
    }
};
