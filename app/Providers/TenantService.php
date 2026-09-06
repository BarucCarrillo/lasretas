<?php

namespace App\Providers;

use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantService
{
    public function createTenant(array $data, $user)
    {
        return DB::transaction(function () use ($data, $user) {

            $slug = Str::slug($data['name']);
            $uniqueSlug = $slug . '-' . rand(1000, 9999);

            $tenant = Tenant::create([
                'id' => Str::uuid()->toString(),
                'name' => $data['name'],
                'slug' => $uniqueSlug,
                'plan' => 'basic',
                'status' => 'active',
            ]);

            DB::table('tenant_user')->insert([
                'tenant_id' => $tenant->id,
                'user_id' => $user->id,
                'role' => 'tenant_admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $tenant;
        });
    }
}