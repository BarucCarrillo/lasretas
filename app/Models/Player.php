<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    use BelongsToTenant;
    //
    protected $fillable = [
        'team_id',
        'name',
        'jersey_number',
        'photo',
        'is_visible'
    ];

    //one player belongs to  one team
    public function team() : BelongsTo 
    {
        return $this->belongsTo(Team::class);    
    }

    //one player can have many events
    public function events() : HasMany 
    {
        return $this->hasMany(MatchEvent::class);    
    }
}
