<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Override;

class TenantScope implements Scope
{
    #[Override]
    public function apply(Builder $builder, Model $model): void
    {
        if (app()->has('tenant')) {
            $builder->where('tenant_id', app('tenant')->id);
        }
    }
}
