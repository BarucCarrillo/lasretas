<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    //
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['id', 'name', 'slug', 'plan', 'status'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function leagues(): HasMany
    {
        return $this->hasMany(League::class);
    }
}
