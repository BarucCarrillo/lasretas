<?php

namespace App\Traits;

use App\Models\Scopes\TenantScope;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (app()->has('tenant') && empty($model->tenant_id)) {
                $model->tenant_id = app('tenant')->id;
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
