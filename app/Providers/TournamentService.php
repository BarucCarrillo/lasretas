<?php

namespace App\Providers;

use App\Models\Tournament;
use Illuminate\Support\Str;


class TournamentService
{
    public function createTournament(array $data)
    {
        $data['slug'] = Str::slug($data['name']) . '-';

        return Tournament::create($data);
    }
}