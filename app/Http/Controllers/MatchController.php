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
            ->orderBy('match_date', 'desc')
            ->get();

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
            'local_team_id' => 'required|exists:teams,id|different:visitor_team_id',
            'visitor_team_id' => 'required|exists:teams,id',
            'match_date' => 'required|date',
            'match_type' => 'required|in:regular_season,round_of_16,quarterfinals,semifinals,final',
            'round_group' => 'nullable|string|max:50',
        ], [
            'local_team_id.different' => 'El equipo local y visitante no pueden ser el mismo.'
        ]);

        $validated['tournament_id'] = $tournament->id;
        $validated['status'] = 'scheduled';
        $validated['leg'] = 1;

        Matches::create($validated);

        return redirect()->back()->with('success', 'Partido programado correctamente.');
    }
}
