<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Player;
use App\Models\Team;
use App\Models\Tournament;
use App\Providers\PlayerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    //
    // public function index($tenant, League $league, Tournament $tournament, Team $team, Player $player): Response
    // {
    //     $player = Player::where('team_id', $team->id)
    //         ->orderBy('name')
    //         ->get();

    //     return Inertia::render('Tenants/Teams/Edit', [
    //         'league' => $league,
    //         'tournament' => $tournament,
    //         'team' => $team,
    //         'player' => $player
    //     ]);
    // }

    public function store(Request $request, $tenant, League $league, Tournament $tournament, Team $team, Player $player, PlayerService $playerService): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:20',
            'jersey_number' => 'required|digits:2',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_visible' => 'boolean',
        ]);

        $validated['team_id'] = $team->id;
        
        $playerService->createPlayer($validated);

        return redirect()->back()->with('success', 'Jugadores añadidos correctamente.');
    }
}
