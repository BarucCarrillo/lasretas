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
}
