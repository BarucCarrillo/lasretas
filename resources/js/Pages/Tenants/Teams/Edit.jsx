import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ auth, team, tournament, league, users }) {
    const { currentTenant } = usePage().props;

    // Inicializamos el formulario con los datos actuales del equipo
    const { data, setData, put, processing, errors } = useForm({
        name: team.name || '',
        captain_id: team.captain_id || '',
        is_visible: team.is_visible ? true : false,
    });

    const submit = (e) => {
        e.preventDefault();
        // Usamos PUT enviando tenant, tournament y team (la liga se inyecta automáticamente o puedes mandarla si tu ruta lo pide)
        put(route('tenant.teams.update', {
            tenant: currentTenant.slug,
            league: league.slug,
            tournament: tournament.slug,
            team: team.slug
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Editar Equipo: {team.name}</h2>}
        >
            <Head title="Editar Equipo" />

            <div className="py-12 max-w-2xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <form onSubmit={submit} className="space-y-4">

                        {/* Nombre del Equipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </div>

                        {/* Capitán */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capitán</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={data.captain_id}
                                onChange={e => setData('captain_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.first_name} {u.last_name}
                                    </option>
                                ))}
                            </select>
                            {errors.captain_id && <div className="text-red-500 text-sm">{errors.captain_id}</div>}
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                checked={data.is_visible}
                                onChange={e => setData('is_visible', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">Equipo Público</span>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            {/* Botón para regresar sin guardar */}
                            <Link
                                href={route('tenant.teams.index', { tenant: currentTenant.slug, league: league.slug, tournament: tournament.slug })}
                                className="text-gray-600 hover:text-gray-900 underline text-sm"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Actualizar Equipo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}