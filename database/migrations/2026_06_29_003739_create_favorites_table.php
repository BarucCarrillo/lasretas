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
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');

            //favorite_id, favorite_type
            $table->morphs('favoritable');

            $table->timestamps();

            //avoid duplicates
            $table->unique(['user_id', 'favoritable_id', 'favoritable_type'], 'unique_user_favorite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
