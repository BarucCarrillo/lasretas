<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Tournament;
use App\Providers\TournamentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TournamentController extends Controller
{
    //
    public function index($tenant, League $league): Response
    {
        $tournaments = Tournament::where('league_id', $league->id)->latest()->get();

        return Inertia::render('Tenants/Tournaments/Index', [
            'tournaments' => $tournaments,
            'league' => $league
        ]);
    }

    public function store(Request $request, $tenant, League $league, TournamentService $tournamentService): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'format' => 'required|in:league,liguilla,knockout',
            'playoff_teams_count' => 'nullable|integer|min:2',
            'penalties_extra_point' => 'boolean',
            'is_visible' => 'boolean',
        ]);

        $validated['league_id'] = $league->id;

        $tournamentService->createTournament($validated);

        return redirect()->back()->with('success', 'Torneo creado con éxito');
    }

    public function edit($tenant, League $league, Tournament $tournament): Response
    {
        return Inertia::render('Tenants/Tournaments/Edit', [
            'tournament' => $tournament,
            'league' => $league
        ]);
    }

    public function update(Request $request, $tenant, League $league, Tournament $tournament): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'format' => 'required|in:league,liguilla,knockout',
            'playoff_teams_count' => 'nullable|integer|min:2',
            'penalties_extra_point' => 'boolean',
            'is_visible' => 'boolean',
            'slug' => 'required|string|max:20'
        ]);

        $tournament->update($validated);

        return redirect()->route('tenant.tournaments.index', [
            'tenant' => $tenant,
            'league' => $league->slug
        ])->with('success', 'Torneo actualizado con éxito.');
    }

    public function destroy($tenant, League $league, Tournament $tournament): RedirectResponse
    {
        $tournament->delete();

        return redirect()->route('tenant.tournaments.index', [
            'tenant' => $tenant,
            'league' => $league->slug
        ])->with('success', 'Torneo eliminado con éxito');
    }
}
