<?php

namespace App\Providers;

use App\Models\Tournament;

class TournamentService
{
    public function createTournament(array $data)
    {
        return Tournament::create($data);
    }
}