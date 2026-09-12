<?php

namespace App\Providers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class TeamService
{
    public function createTeam(array $data, $logoFile = null)
    {
        if ($logoFile) {
            $data['logo'] = $logoFile->store('teams', 'public');
        }

        $team = Team::create($data);

        $user = User::find($data['captain_id']);

        if ($user && $user->role === 'user'){
            $user->update([
                'role' => 'captain'
            ]);
        }

        return $team;
    }

    public function updateTeam(Team $team, array $data, $logoFile = null)
    {
        if ($logoFile) {
            if ($team->logo) {
                Storage::disk('public')->delete($team->logo);
            }
            $data['logo'] = $logoFile->store('teams', 'public');
        }

        return $team->update($data);
    }
}
