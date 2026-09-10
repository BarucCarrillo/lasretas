import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ auth, tournament, leagues }) {
    const { currentTenant } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        league_id: tournament.league_id || '',
        name: tournament.name || '',
        format: tournament.format || 'liguilla',
        playoff_teams_count: tournament.playoff_teams_count || '',
        penalties_extra_point: tournament.penalties_extra_point || false,
        is_visible: tournament.is_visible || false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('tenant.tournaments.update', { tenant: currentTenant.slug, tournament: tournament.id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Editar Torneo: {tournament.name}</h2>}
        >
            <Head title={`Editar ${tournament.name}`} />

            <div className="py-12 max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 shadow sm:rounded-lg">

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Liga */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Liga a la que pertenece</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.league_id}
                                    onChange={e => setData('league_id', e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona una Liga...</option>
                                    {leagues.map(league => (
                                        <option key={league.id} value={league.id}>{league.name}</option>
                                    ))}
                                </select>
                                {errors.league_id && <div className="text-red-500 text-sm mt-1">{errors.league_id}</div>}
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre del Torneo</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            {/* Formato */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Formato</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.format}
                                    onChange={e => setData('format', e.target.value)}
                                >
                                    <option value="league">Liga</option>
                                    <option value="liguilla">Liguilla</option>
                                    <option value="knockout">Eliminatoria Directa</option>
                                </select>
                            </div>

                            {/* Equipos Liguilla */}
                            {data.format === 'liguilla' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipos a Liguilla</label>
                                    <input
                                        type="number"
                                        min="2"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={data.playoff_teams_count}
                                        onChange={e => setData('playoff_teams_count', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-6 mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                    checked={data.penalties_extra_point}
                                    onChange={e => setData('penalties_extra_point', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Punto extra en penales</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                    checked={data.is_visible}
                                    onChange={e => setData('is_visible', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Torneo público</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-4 mt-6">
                            <Link
                                href={route('tenant.tournaments.index', { tenant: currentTenant.slug })}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                                Actualizar Torneo
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}