import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ auth, league, tournament, match, teams }) {
    const { currentTenant } = usePage().props;

    // Función para formatear "2026-11-15 20:00:00" a "2026-11-15T20:00"
    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        return dateString.replace(' ', 'T').substring(0, 16);
    };

    const { data, setData, put, errors, processing } = useForm({
        local_team_id: match.local_team_id || '',
        visitor_team_id: match.visitor_team_id || '',
        match_date: formatDateTime(match.match_date),
        matchday: match.matchday || '',
        match_type: match.match_type || 'regular_season',
    });

    const submit = (e) => {
        e.preventDefault();
        // Ajusta los parámetros de tu ruta según cómo estén en web.php
        put(route('tenant.matches.update', {
            tenant: currentTenant.slug,
            league: league.slug || league.id,
            tournament: tournament.slug || tournament.id,
            match: match.id
        }));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Editar Partido" />

            <div className="py-12 max-w-2xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">
                        Editar Partido - {tournament.name}
                    </h2>

                    <form onSubmit={submit} className="space-y-4">

                        {/* Tipo de Partido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Partido</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={data.match_type}
                                onChange={(e) => setData('match_type', e.target.value)}
                            >
                                <option value="regular_season">Temporada Regular</option>
                                <option value="round_of_16">Octavos de Final</option>
                                <option value="quarterfinals">Cuartos de Final</option>
                                <option value="semifinals">Semifinales</option>
                                <option value="final">Final</option>
                            </select>
                        </div>

                        {/* Jornada */}
                        {data.match_type === 'regular_season' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jornada</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.matchday}
                                    onChange={(e) => setData('matchday', e.target.value)}
                                />
                                {errors.matchday && <span className="text-red-500 text-xs">{errors.matchday}</span>}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {/* Equipo Local */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Local</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.local_team_id}
                                    onChange={(e) => setData('local_team_id', e.target.value)}
                                >
                                    <option value="">Seleccione equipo...</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                                {errors.local_team_id && <span className="text-red-500 text-xs">{errors.local_team_id}</span>}
                            </div>

                            {/* Equipo Visitante */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Visitante</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.visitor_team_id}
                                    onChange={(e) => setData('visitor_team_id', e.target.value)}
                                >
                                    <option value="">Seleccione equipo...</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                                {errors.visitor_team_id && <span className="text-red-500 text-xs">{errors.visitor_team_id}</span>}
                            </div>
                        </div>

                        {/* Fecha y Hora */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                value={data.match_date}
                                onChange={(e) => setData('match_date', e.target.value)}
                            />
                            {errors.match_date && <span className="text-red-500 text-xs">{errors.match_date}</span>}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center justify-end mt-6 space-x-3">
                            <Link
                                href={route('tenant.tournaments.show', {
                                    tenant: currentTenant.slug,
                                    league: league.slug || league.id,
                                    tournament: tournament.slug || tournament.id
                                })}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}