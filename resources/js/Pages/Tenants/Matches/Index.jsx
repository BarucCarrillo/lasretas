import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Index({ auth, league, tournament, teams, matches }) {
    const { currentTenant } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        local_team_id: '',
        visitor_team_id: '',
        match_date: '',
        match_type: 'regular_season',
        round_group: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tenant.matches.store', {
            tenant: currentTenant.slug,
            league: league.slug,
            tournament: tournament.slug
        }), {
            preserveScroll: true,
            onSuccess: () => reset(), // Limpia el formulario si se guarda bien
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Partidos: {tournament.name}</h2>}
        >
            <Head title={`Partidos - ${tournament.name}`} />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* FORMULARIO PARA PROGRAMAR PARTIDO */}
                <div className="bg-white p-6 shadow sm:rounded-lg lg:col-span-1 h-fit">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Programar Nuevo Partido</h3>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Equipo Local</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 sm:text-sm"
                                value={data.local_team_id}
                                onChange={e => setData('local_team_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar Local...</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                            {errors.local_team_id && <div className="text-red-500 text-xs mt-1">{errors.local_team_id}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Equipo Visitante</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 sm:text-sm"
                                value={data.visitor_team_id}
                                onChange={e => setData('visitor_team_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar Visitante...</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id} disabled={team.id.toString() === data.local_team_id.toString()}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            {errors.visitor_team_id && <div className="text-red-500 text-xs mt-1">{errors.visitor_team_id}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 sm:text-sm"
                                value={data.match_date}
                                onChange={e => setData('match_date', e.target.value)}
                                required
                            />
                            {errors.match_date && <div className="text-red-500 text-xs mt-1">{errors.match_date}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo / Fase</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 sm:text-sm"
                                value={data.match_type}
                                onChange={e => setData('match_type', e.target.value)}
                            >
                                <option value="regular_season">Temporada Regular (Jornada)</option>
                                <option value="round_of_16">Octavos de Final</option>
                                <option value="quarterfinals">Cuartos de Final</option>
                                <option value="semifinals">Semifinal</option>
                                <option value="final">Gran Final</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Jornada / Grupo (Opcional)</label>
                            <input
                                type="text"
                                placeholder="Ej. Jornada 1, Grupo A..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 sm:text-sm"
                                value={data.round_group}
                                onChange={e => setData('round_group', e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 py-2 px-4 text-sm font-medium text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Programar Partido
                            </button>
                        </div>
                    </form>
                </div>

                {/* LISTA DE PARTIDOS */}
                <div className="bg-white p-6 shadow sm:rounded-lg lg:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Calendario de Partidos</h3>

                    {matches.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Aún no hay partidos programados.</p>
                    ) : (
                        <div className="space-y-4">
                            {matches.map(match => (
                                <div key={match.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50 hover:bg-white transition">

                                    <div className="flex-1 text-right pr-4 font-bold text-gray-800">
                                        {match.local_team.name}
                                    </div>

                                    <div className="flex flex-col items-center justify-center px-4 border-x border-gray-200 min-w-[140px]">
                                        <span className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
                                            {match.match_type.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm bg-gray-800 text-white px-3 py-1 rounded-full font-mono">
                                            {new Date(match.match_date).toLocaleString('es-MX', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                        {match.status === 'scheduled' && (
                                            <span className="text-xs text-blue-600 mt-1">Programado</span>
                                        )}
                                    </div>

                                    <div className="flex-1 text-left pl-4 font-bold text-gray-800">
                                        {match.visitor_team.name}
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}