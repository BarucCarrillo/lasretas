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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            //foreign key structure
            $table->foreignUuid('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('tournament_id')->constrained('tournaments')->onDelete('cascade');

            //foreign key for the teams
            $table->foreignId('local_team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('visitor_team_id')->constrained('teams')->onDelete('cascade');

            //schedule match
            $table->dateTime('match_date');
            $table->string('status')->default('scheduled');

            //phase where the game is
            $table->enum('match_type', [
                'regular_season',
                'round_of_16',
                'quarterfinals',
                'semifinals',
                'final'
            ])->default('regular_season');

            //control 1st or 2nd leg
            $table->integer('leg')->default(1);

            //gruop legs
            $table->string('round_group')->nullable();

            //standigs
            $table->integer('local_score')->nullable();
            $table->integer('visitor_score')->nullable();

            //penalties standings
            $table->integer('local_penalties')->nullable();
            $table->integer('visitor_penalties')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
