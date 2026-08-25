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
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('league_id')->constrained('leagues')->onDelete('cascade');
            $table->string('name');
            $table->string('logo')->nullable();
            $table->enum('format', ['league', 'liguilla', 'knockout'])->default('liguilla');
            $table->integer('playoff_teams_count')->nullable();
            $table->boolean('penalties_extra_point')->default(false);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};
