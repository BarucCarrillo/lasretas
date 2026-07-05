<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tournament extends Model
{
    //
    protected $fillable = [
        'tenant_id',
        'league_id',
        'name',
        'format',
        'playoff_teams_count',
        'penalties_extra_point',
        'is_visible'
    ];

    //one tournament belongs to a one league
    public function league(): BelongsTo 
    {
        return $this->belongsTo(League::class);
    }

    //one tournament has many teams
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    //one tournament has many matches
    public function matches(): HasMany
    {
        return $this->hasMany(Matches::class);
    }
}
