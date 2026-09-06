<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class SetTenantContext
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $slug = $request->route('tenant');

        if (!$slug) {
            abort(404);
        }

        $tenant = Tenant::where('slug', $slug)->where('status', 'active')->firstOrFail();

        $user = $request->user();

        if ($user->role !== 'superadmin') {
            $hasAccess = DB::table('tenant_user')
                ->where('tenant_id', $tenant->id)
                ->where('user_id', $user->id)
                ->exists();
            
            if (!$hasAccess) {
                abort(403, 'Acceso limitado.');
            }
        }

        app()->instance('tenant', $tenant);

        URL::defaults(['tenant' => $tenant->slug]);

        Inertia::share('currentTenant', $tenant);

        return $next($request);
    }
}
