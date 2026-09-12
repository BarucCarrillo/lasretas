<?php

use App\Http\Controllers\LeagueController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\TournamentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/onboarding/cancha', [TenantController::class, 'create'])->name('tenant.create');
    Route::post('/onboarding/cancha', [TenantController::class, 'store'])->name('tenant.store');
});

Route::middleware(['auth', 'tenant'])->prefix('{tenant}')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Tenants/Dashboard');
    })->name('tenant.dashboard');

    //ROUTES LEAGUES
    Route::get('/ligas', [LeagueController::class, 'index'])->name('tenant.leagues.index');
    Route::post('/ligas', [LeagueController::class, 'store'])->name('tenant.leagues.store');

    //ROUTES LEAGUES EDIT
    Route::get('/ligas/{league}/editar', [LeagueController::class, 'edit'])->name('tenant.leagues.edit');
    Route::put('/ligas/{league}', [LeagueController::class, 'update'])->name('tenant.leagues.update');

    //ROUTES TOURNAMENTS
    Route::get('/torneos', [TournamentController::class, 'index'])->name('tenant.tournaments.index');
    Route::post('/torneos', [TournamentController::class, 'store'])->name('tenant.tournaments.store');

    //ROUTES EDIT TOURNAMENTS
    Route::get('/torneos/{tournament}/editar', [TournamentController::class, 'edit'])->name('tenant.tournaments.edit');
    Route::put('/torneos/{tournament}', [TournamentController::class, 'update'])->name('tenant.tournaments.update');
    
    //ROUTES DELETE TOURNAMENTS
    Route::delete('/torneos/{tournament}', [TournamentController::class, 'destroy'])->name('tenant.tournaments.destroy');

    //ROUTES TEAMS
    Route::get('/equipos', [TeamController::class, 'index'])->name('tenant.teams.index');
    Route::post('/equipos', [TeamController::class, 'store'])->name('tenant.teams.store');
    Route::delete('/equipos/{team}', [TeamController::class, 'destroy'])->name('tenant.teams.destroy');
});

require __DIR__.'/auth.php';
