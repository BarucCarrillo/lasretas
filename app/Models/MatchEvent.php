<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchEvent extends Model
{
    //
    protected $table = 'match_events';

    protected $fillable = [
        'tenant_id',
        'match_id',
        'team_id',
        'player_id',
        'type',
        'minute'
    ];

    //one event belongs to one match
    public function match() : BelongsTo 
    {
        return $this->belongsTo(Matches::class, 'match_id');    
    }

    //one event is for one team
    public function team() : BelongsTo 
    {
        return $this->belongsTo(Team::class);    
    }

    //one events was done by one player, can be null
    public function player() : BelongsTo 
    {
        return $this->belongsTo(Player::class);    
    }
}
