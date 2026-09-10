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
    public function index(): Response
    {
        $tournaments = Tournament::with('league')->latest()->get();

        $leagues = League::where('status', 'active')->orderBy('name')->get();

        return Inertia::render('Tenants/Tournaments/Index', [
            'tournaments' => $tournaments,
            'leagues' => $leagues 
        ]);
    }

    public function store(Request $request, TournamentService $tournamentService): RedirectResponse
    {
        $validated = $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'name' => 'required|string|max:255',
            'format' => 'required|in:league,liguilla,knockout',
            'playoff_teams_count' => 'nullable|integer|min:2',
            'penalties_extra_point' => 'boolean',
            'is_visible' => 'boolean',
        ]);

        $tournamentService->createTournament($validated);

        return redirect()->back()->with('success', 'Torneo creado con éxito');
    }

    public function edit($tenant, Tournament $tournament): Response
    {
        $leagues = League::where('status', 'active')->orderBy('name')->get();

        return Inertia::render('Tenants/Tournaments/Edit', [
            'tournament' => $tournament,
            'leagues' => $leagues
        ]);
    }

    public function update(Request $request, $tenant, Tournament $tournament): RedirectResponse
    {
        $validated = $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'name' => 'required|string|max:255',
            'format' => 'required|in:league,liguilla,knockout',
            'playoff_teams_count' => 'nullable|integer|min:2',
            'penalties_extra_point' => 'boolean',
            'is_visible' => 'boolean',
        ]);

        $tournament->update($validated);

        return redirect()->route('tenant.tournaments.index')->with('success', 'Torneo actualizado con éxito.');
    }

    public function destroy($tenant, Tournament $tournament): RedirectResponse
    {
        $tournament->delete();

        return redirect()->route('tenant.tournaments.index')->with('success', 'Torneo eliminado con éxito');
    }
}
