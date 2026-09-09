<?php

namespace App\Providers;

use App\Models\League;
use Illuminate\Support\Str;

class LeagueService
{
    public function createLeague(array $data)
    {
        $data['slug'] = Str::slug($data['name']) . '-';

        return League::create($data);
    }
}
