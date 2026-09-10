import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function Index({ auth, tournaments, leagues }) {
    const { currentTenant } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        league_id: '',
        name: '',
        format: 'liguilla',
        playoff_teams_count: '',
        penalties_extra_point: false,
        is_visible: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tenant.tournaments.store', { tenant: currentTenant.slug }), {
            onSuccess: () => reset('name', 'playoff_teams_count'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Torneos</h2>}
        >
            <Head title="Mis Torneos" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                {/* Formulario de Creación */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Torneo</h3>

                    {leagues.length === 0 ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <p className="text-sm text-yellow-700">
                                Necesitas crear al menos una <strong>Liga</strong> activa antes de poder crear torneos.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Liga */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Liga a la que pertenece</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

                                {/* Nombre del Torneo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre del Torneo</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. Apertura 2024"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </div>

                                {/* Formato */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Formato de Competencia</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={data.format}
                                        onChange={e => setData('format', e.target.value)}
                                    >
                                        <option value="league">Liga (Solo puntos)</option>
                                        <option value="liguilla">Liguilla (Fase regular + Eliminatorias)</option>
                                        <option value="knockout">Eliminatoria Directa (Copa)</option>
                                    </select>
                                </div>

                                {/* Equipos Clasificados (Condicional) */}
                                {data.format === 'liguilla' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Equipos que clasifican a Liguilla</label>
                                        <input
                                            type="number"
                                            min="2"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={data.playoff_teams_count}
                                            onChange={e => setData('playoff_teams_count', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Opciones extra */}
                            <div className="flex gap-6 mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        checked={data.penalties_extra_point}
                                        onChange={e => setData('penalties_extra_point', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Punto extra en penales (empate)</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        checked={data.is_visible}
                                        onChange={e => setData('is_visible', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Torneo público (visible)</span>
                                </label>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="submit"
                                    disabled={processing || leagues.length === 0}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Guardar Torneo
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Lista de Torneos */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Torneos Activos</h3>

                    {tournaments.length === 0 ? (
                        <p className="text-gray-500">No hay torneos registrados.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {tournaments.map((tournament) => (
                                <li key={tournament.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {tournament.name}
                                            {!tournament.is_visible && <span className="ml-2 text-xs text-red-500 border border-red-500 rounded px-2 py-0.5">Oculto</span>}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Liga: {tournament.league?.name} | Formato: {tournament.format}
                                            {tournament.penalties_extra_point && ' | (+1 Pto Penales)'}
                                        </p>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex space-x-4">
                                        <Link
                                            href={route('tenant.tournaments.edit', { tenant: currentTenant.slug, tournament: tournament.id })}
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('¿Estás seguro de eliminar este torneo? Se borrarán partidos y estadísticas.')) {
                                                    router.delete(route('tenant.tournaments.destroy', { tenant: currentTenant.slug, tournament: tournament.id }));
                                                }
                                            }}
                                            className="text-sm text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}