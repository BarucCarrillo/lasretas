<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class League extends Model
{
    use BelongsToTenant;
    //
    protected $fillable = ['name', 'description', 'logo', 'slug', 'status'];

    //league belogns to a complex
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    //one league has many tournaments
    public function tournaments(): HasMany
    {
        return $this->hasMany(Tournament::class);
    }
}
