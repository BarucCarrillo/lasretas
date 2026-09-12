<?php

namespace App\Http\Controllers;

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
    public function index(): Response
    {
        $tenant = app('tenant');

        $teams = Team::with(['tournament', 'captain'])->latest()->get();

        $tournaments = Tournament::where('is_visible', true)->orderBy('name')->get();

        $users = User::select('id', 'first_name', 'last_name', 'email', 'role')
            ->orderBy('first_name')
            ->get();

        return Inertia::render('Tenants/Teams/Index', [
            'teams' => $teams,
            'tournaments' => $tournaments,
            'users' => $users
        ]);
    }

    public function store(Request $request, TeamService $teamService): RedirectResponse
    {
        $validated = $request->validate([
            'tournament_id' => 'required|exists:tournaments,id',
            'captain_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_visible' => 'boolean',
        ]);

        $teamService->createTeam($validated, $request->file('logo'));

        return redirect()->back()->with('success', 'Equipo creado y asignado con éxito.');
    }

    public function destroy(Team $team)
    {
        if ($team->logo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($team->logo);
        }
        $team->delete();

        return redirect()->back()->with('success', 'Equipo eliminado.');
    }
}
