<?php

namespace App\Providers;

use App\Models\Player;

class PlayerService
{
    public function createPlayer(array $data) 
    {
        $player = Player::create($data);

        return $player;
    }
}