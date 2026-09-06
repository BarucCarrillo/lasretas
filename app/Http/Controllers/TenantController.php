<?php

namespace App\Http\Controllers;

use App\Providers\TenantService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    //
    public function create(): Response
    {
        return Inertia::render('Tenants/Create');
    }

    public function store(Request $request, TenantService $tenantService): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tenants,name'],
        ]);

        $tenant = $tenantService->createTenant($validated, $request->user());

        return redirect()->route('dashboard')->with('success', '¡Complejo creado con éxito!');
    }
}
