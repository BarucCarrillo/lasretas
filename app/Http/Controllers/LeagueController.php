<?php

namespace App\Http\Controllers;

use App\Providers\LeagueService;
use App\Models\League;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
    //
    public function index(): Response 
    {
        $leagues = League::latest()->get();

        return Inertia::render('Tenants/Leagues/Index', [
            'leagues' => $leagues
        ]);
    }

    public function store(Request $request, LeagueService $leagueService): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500'
        ]);

        $leagueService->createLeague($validated);

        return redirect()->back();
    }

    public function edit($tenant, League $league) : Response {
        return Inertia::render('Tenants/Leagues/Edit', [
            'league' => $league
        ]);
    }

    public function update(Request $request, $tenant, League $league): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive',
        ]);

        $league->update($validated);

        return redirect()->route('tenant.leagues.index')->with('success', 'Liga actualizada correctamente.');
    }
}
