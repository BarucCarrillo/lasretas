<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Matches;
use App\Models\Team;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatchController extends Controller
{
    //
    public function index($tenant, League $league, Tournament $tournament)
    {
        $teams = Team::where('tournament_id', $tournament->id)->get();

        $matches = Matches::where('tournament_id', $tournament->id)
            ->with(['localTeam', 'visitorTeam'])
            ->orderBy('matchday', 'asc')
            ->orderBy('match_date', 'asc')
            ->get()
            ->groupBy('matchday');

        return Inertia::render('Tenants/Matches/Index', [
            'league' => $league,
            'tournament' => $tournament,
            'teams' => $teams,
            'matches' => $matches
        ]);
    }

    public function store(Request $request, $tenant, League $league, Tournament $tournament)
    {
        $validated = $request->validate([
            'local_team_id' => [
                'required','exists:teams,id','different:visitor_team_id',
                function ($attribute, $value, $fail) use ($request, $tournament) {
                    if (!$request->matchday) return;

                    $conflict = Matches::where('tournament_id', $tournament->id)
                        ->where('matchday', $request->matchday)
                        ->where(function ($query) use ($value) {
                            $query->where('local_team_id', $value)
                                ->orWhere('visitor_team_id', $value);
                        })
                        ->exists();

                    if ($conflict) {
                        $fail("El equipo local ya tiene un partido asignado para la jornada {$request->matchday}");
                    }
                },
            ],
            'visitor_team_id' => [
                'required','exists:teams,id',
                function ($attribute, $value, $fail) use ($request, $tournament) {
                    if (!$request->matchday) return;

                    $conflict = Matches::where('tournament_id', $tournament->id)
                        ->where('matchday', $request->matchday)
                        ->where(function ($query) use ($value) {
                            $query->where('local_team_id', $value)
                                ->orWhere('visitor_team_id', $value);
                        })
                        ->exists();

                    if ($conflict) {
                        $fail("El equipo visitante ya tiene un partido asignado para la jornada {$request->matchday}");
                    }
                },
            ],
            'match_type' => 'required|in:regular_season,round_of_16,quarterfinals,semifinals,final',
            'round_group' => 'nullable|string|max:50',
            'match_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($tournament) {
                    $conflict = Matches::where('tournament_id', $tournament->id)
                        ->where('match_date', $value)
                        ->exists();

                    if ($conflict) {
                        $fail('Ya hay un partido programadoa esta misma fecha y hora.');
                    };
                }
            ],
            'matchday' => 'required'
        ], [
            'local_team_id.different' => 'El equipo local y visitante no pueden ser el mismo.'
        ]);

        $validated['tournament_id'] = $tournament->id;
        $validated['status'] = 'scheduled';
        $validated['leg'] = 1;

        Matches::create($validated);

        return redirect()->back()->with('success', 'Partido programado correctamente.');
    }

    public function edit($tenant, League $league, Tournament $tournament, Matches $match)
    {
        $teams = Team::where('tournament_id', $tournament->id)->get();

        return Inertia::render('Tenants/Matches/Edit', [
            'league' => $league,
            'tournament' => $tournament,
            'match' => $match,
            'teams' => $teams
        ]);
    }

    public function update(Request $request, $tenant, League $league, Tournament $tournament, Matches $match)
    {
        $validated = $request->validate([
            'match_type' => 'required|in:regular_season,round_of_16,quarterfinals,semifinals,final',
            'round_group' => 'nullable|string|max:50',
            'matchday' => 'nullable|integer|min:1',

            'local_team_id' => [
                'required',
                'exists:teams,id',
                'different:visitor_team_id',
                function ($attribute, $value, $fail) use ($request, $tournament, $match) {
                    if (!$request->matchday) return;

                    $conflict = Matches::where('tournament_id', $tournament->id)
                        ->where('id', '!=', $match->id) // IGNORAR EL PARTIDO ACTUAL
                        ->where('matchday', $request->matchday)
                        ->where(function ($query) use ($value) {
                            $query->where('local_team_id', $value)
                                ->orWhere('visitor_team_id', $value);
                        })
                        ->exists();

                    if ($conflict) {
                        $fail("El equipo local ya tiene un partido asignado en la jornada {$request->matchday}.");
                    }
                },
            ],

            'visitor_team_id' => [
                'required',
                'exists:teams,id',
                function ($attribute, $value, $fail) use ($request, $tournament, $match) {
                    if (!$request->matchday) return;

                    $conflict = Matches::where('tournament_id', $tournament->id)
                        ->where('id', '!=', $match->id) // IGNORAR EL PARTIDO ACTUAL
                        ->where('matchday', $request->matchday)
                        ->where(function ($query) use ($value) {
                            $query->where('local_team_id', $value)
                                ->orWhere('visitor_team_id', $value);
                        })
                        ->exists();

                    if ($conflict) {
                        $fail("El equipo visitante ya tiene un partido asignado en la jornada {$request->matchday}.");
                    }
                },
            ],

            'match_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($tournament, $match) {
                    $conflict = Matches::where('tournament_id', $tournament->id)
                        ->where('id', '!=', $match->id) // IGNORAR EL PARTIDO ACTUAL
                        ->where('match_date', $value)
                        ->exists();

                    if ($conflict) {
                        $fail('Ya hay un partido programado a esta misma fecha y hora.');
                    }
                },
            ],
        ], [
            'local_team_id.different' => 'El equipo local y visitante no pueden ser el mismo.'
        ]);

        $match->update($validated);

        // Redirigimos de vuelta a la vista del torneo
        return redirect()->route('tenant.tournaments.show', [
            'tenant' => $tenant,
            'league' => $league->slug ?? $league->id,
            'tournament' => $tournament->slug ?? $tournament->id
        ])->with('success', 'Partido actualizado correctamente.');
    }
}
