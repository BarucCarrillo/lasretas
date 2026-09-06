<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Tenant;
use App\Models\League;
use App\Models\Tournament;
use App\Models\Team;
use App\Models\Player;
use App\Models\Matches;
use App\Models\MatchEvent;
use App\Models\Favorite;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. CREAR USUARIOS
        // Tú (El SuperAdmin de la plataforma)
        $superAdmin = User::create([
            'first_name' => 'CEO',
            'last_name' => 'SaaS',
            'email' => 'admin@misaas.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
        ]);

        // Dueño de la cancha
        $canchaAdmin = User::create([
            'first_name' => 'Carlos',
            'last_name' => 'Administrador',
            'email' => 'carlos@cancha.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Capitanes de los equipos
        $capitan1 = User::create([
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan@equipo.com',
            'password' => Hash::make('password'),
        ]);

        $capitan2 = User::create([
            'first_name' => 'Miguel',
            'last_name' => 'Gómez',
            'email' => 'miguel@equipo.com',
            'password' => Hash::make('password'),
        ]);

        // Aficionado normal
        $aficionado = User::create([
            'first_name' => 'Luis',
            'last_name' => 'Lector',
            'email' => 'luis@aficionado.com',
            'password' => Hash::make('password'),
        ]);

        // 2. CREAR EL COMPLEJO DEPORTIVO (TENANT)
        // Nota: Como Tenant usa UUID string, lo generamos manualmente si no tiene el trait HasUuids
        $tenantId = Str::uuid()->toString();
        $tenant = Tenant::create([
            'id' => $tenantId,
            'name' => 'Complejo Deportivo La Cantera',
            'slug' => 'la-cantera',
            'plan' => 'pro',
            'status' => 'active',
        ]);

        // 3. VINCULAR AL DUEÑO CON SU CANCHA (Tabla pivote tenant_user)
        DB::table('tenant_user')->insert([
            'tenant_id' => $tenant->id,
            'user_id' => $canchaAdmin->id,
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. CREAR LIGA Y TORNEO
        $liga = League::create([
            'tenant_id' => $tenant->id,
            'name' => 'Liga Dominical Libre',
            'description' => 'El mejor torneo de los domingos por la mañana.',
            'slug' => 'dominical-libre'
        ]);

        $torneo = Tournament::create([
            'tenant_id' => $tenant->id,
            'league_id' => $liga->id,
            'name' => 'Torneo Apertura 2026',
            'format' => 'liguilla',
            'playoff_teams_count' => 8,
            'penalties_extra_point' => false,
        ]);

        // 5. CREAR EQUIPOS
        $equipoA = Team::create([
            'tenant_id' => $tenant->id,
            'tournament_id' => $torneo->id,
            'captain_id' => $capitan1->id,
            'name' => 'Real Bañil FC',
        ]);

        $equipoB = Team::create([
            'tenant_id' => $tenant->id,
            'tournament_id' => $torneo->id,
            'captain_id' => $capitan2->id,
            'name' => 'Galácticos 7',
        ]);

        // 6. CREAR JUGADORES (Plantillas)
        $jugador1 = Player::create([
            'tenant_id' => $tenant->id,
            'team_id' => $equipoA->id,
            'name' => 'Hugo Sánchez',
            'jersey_number' => 9,
        ]);

        $jugador2 = Player::create([
            'tenant_id' => $tenant->id,
            'team_id' => $equipoB->id,
            'name' => 'Rafa Márquez',
            'jersey_number' => 4,
        ]);

        // 7. CREAR UN PARTIDO Y EVENTOS (Simulando un partido terminado)
        $partido = Matches::create([
            'tenant_id' => $tenant->id,
            'tournament_id' => $torneo->id,
            'local_team_id' => $equipoA->id,
            'visitor_team_id' => $equipoB->id,
            'match_date' => now()->subDays(1), // Se jugó ayer
            'status' => 'finished',
            'match_type' => 'regular_season',
            'local_score' => 1,
            'visitor_score' => 0,
        ]);

        // Registrar el gol de Hugo Sánchez
        MatchEvent::create([
            'tenant_id' => $tenant->id,
            'match_id' => $partido->id,
            'team_id' => $equipoA->id,
            'player_id' => $jugador1->id,
            'type' => 'goal',
            'minute' => 25,
        ]);

        // Registrar una tarjeta amarilla a Rafa Márquez
        MatchEvent::create([
            'tenant_id' => $tenant->id,
            'match_id' => $partido->id,
            'team_id' => $equipoB->id,
            'player_id' => $jugador2->id,
            'type' => 'yellow_card',
            'minute' => 60,
        ]);

        // 8. CREAR FAVORITOS (El aficionado sigue al equipo A)
        Favorite::create([
            'tenant_id' => $tenant->id,
            'user_id' => $aficionado->id,
            'favoritable_id' => $equipoA->id,
            'favoritable_type' => Team::class,
        ]);
    }
}
