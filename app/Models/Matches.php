<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Matches extends Model
{
    //
    protected $table = 'matches';
    
    protected $fillable = [
        'tenant_id',
        'tournament_id',
        'local_team_id',
        'visitor_team_id',
        'match_date',
        'status',
        'match_type',
        'leg',
        'round_group',
        'local_score',
        'visitor_score',
        'local_penalties',
        'visitor_penalties',
    ];

    //one match belongs to one tournament
    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    //match has one local team
    public function localTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'local_team_id');
    }

    //match has one visitor team
    public function visitorTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'visitor_team_id');
    }

    //one matchs has many events
    public function events() : HasMany 
    {
        return $this->hasMany(MatchEvent::class, 'match_id');    
    }
}
