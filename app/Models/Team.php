<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use BelongsToTenant;
    //
    protected $fillable = [
        'tournament_id',
        'captain_id',
        'name',
        'logo',
        'is_visible'
    ];

    protected $casts = [
        'is_visible'
    ];

    //one team belongs to one tournament
    public function tournament(): BelongsTo 
    {
        return $this->belongsTo(Tournament::class);
    }

    //one tema has one captain
    public function captain() : BelongsTo 
    {
        return $this->belongsTo(User::class, 'captain_id');    
    }

    //one team has many players
    public function players() : HasMany
    {
        return $this->hasMany(Player::class);
    }

    //one teamn has many games as local
    public function localMatches(): HasMany
    {
        return $this->hasMany(Matches::class, 'local_team_id');
    }

    //one teamn has many games as visitor
    public function visitorMatches(): HasMany
    {
        return $this->hasMany(Matches::class, 'visitor_team_id');
    }

}
