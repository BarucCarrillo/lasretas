<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\User;
use App\Providers\TeamService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    //
    public function index($tenant, League $league, Tournament $tournament): Response
    {

        $teams = Team::where('tournament_id', $tournament->id)
            ->with(['tournament', 'captain'])
            ->latest()
            ->get();

        $users = User::select('id', 'first_name', 'last_name', 'email', 'role')
            ->orderBy('first_name')
            ->get();

        return Inertia::render('Tenants/Teams/Index', [
            'teams' => $teams,
            'users' => $users,
            'league' => $league,
            'tournament' => $tournament
        ]);
    }

    public function store(Request $request, $tenant, League $league, Team $team, Tournament $tournament, TeamService $teamService): RedirectResponse
    {
        $validated = $request->validate([
            'captain_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_visible' => 'boolean',
        ]);

        $validated['tournament_id'] = $tournament->id;
        
        $teamService->createTeam($validated, $request->file('logo'));

        return redirect()->back()->with('success', 'Equipo creado y asignado con éxito.');
    }

    public function edit($tenant, League $league, Tournament $tournament, Team $team) {
        $users = User::select('id', 'first_name', 'last_name', 'email')->orderBy('first_name')->get();

        return Inertia::render('Tenants/Teams/Edit', [
            'team' => $team,
            'users' => $users,
            'league' => $league,
            'tournament' => $tournament
        ]);
    }

    public function update(Request $request, $tenant, League $league, Tournament $tournament, Team $team) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_visible' => 'boolean',
        ]);

        $team->update($validated); 

        return redirect()->route('tenant.teams.index', [
            'tenant' => $tenant,
            'league' => $league->slug,
            'tournament' => $tournament->slug
        ])->with('success', 'Equipo actualizado correctamente.');
    }

    public function destroy($tenant, League $league, Tournament $tournament, Team $team)
    {
        if ($team->logo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($team->logo);
        }
        $team->delete();

        return redirect()->back()->with('success', 'Equipo eliminado.');
    }
}
