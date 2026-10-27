import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Show({ auth, league, tournament, teams, matches }) {
    const { currentTenant } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">
                        {league.name} <span className="text-gray-400 mx-2">/</span> {tournament.name}
                    </h2>
                    {/* Botón rápido para ir a agregar/gestionar equipos */}
                    <Link
                        href={route('tenant.teams.index', {
                            tenant: currentTenant.slug,
                            league: league.slug,
                            tournament: tournament.slug
                        })}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm"
                    >
                        Gestionar Equipos
                    </Link>
                </div>
            }
        >
            <Head title={`Torneo: ${tournament.name}`} />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                {/* 1. SECCIÓN: DETALLES DEL TORNEO */}
                <div className="bg-white p-6 shadow sm:rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{tournament.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Estado: {tournament.is_visible ? (
                                <span className="text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md">Público y Activo</span>
                            ) : (
                                <span className="text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded-md">Oculto</span>
                            )}
                        </p>
                    </div>

                    <div>
                        <Link
                            href={route('tenant.tournaments.edit', {
                                tenant: currentTenant.slug,
                                league: league.slug,
                                tournament: tournament.slug
                            })}
                            className="text-gray-600 bg-gray-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                        >
                            Configurar Torneo
                        </Link>
                        <Link
                            href={route('tenant.matches.index', {
                                tenant: currentTenant.slug,
                                league: league.slug,
                                tournament: tournament.slug
                            })}
                            className="text-gray-100 bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                            Crear Partido
                        </Link>
                    </div>
                </div>

                {/* 2. SECCIÓN: EQUIPOS INSCRITOS */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">
                        Equipos Inscritos ({teams.length})
                    </h3>

                    {teams.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">No hay equipos inscritos en este torneo todavía.</p>
                            <Link
                                href={route('tenant.teams.index', {
                                    tenant: currentTenant.slug,
                                    league: league.slug,
                                    tournament: tournament.slug
                                })}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                                + Inscribir el primer equipo
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((team) => (
                                <div key={team.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center bg-gray-50 hover:bg-white transition duration-150">
                                    {/* Logo del Equipo */}
                                    {team.logo ? (
                                        <img src={`/storage/${team.logo}`} alt={team.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm mb-3" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-indigo-100 border-2 border-white shadow-sm mb-3 flex items-center justify-center text-indigo-500 font-bold text-2xl">
                                            {team.name.charAt(0)}
                                        </div>
                                    )}

                                    {/* Info del Equipo */}
                                    <h4 className="text-lg font-bold text-gray-900 text-center">{team.name}</h4>

                                    <div className="mt-2 text-sm text-gray-500 text-center w-full">
                                        <p className="flex items-center justify-center gap-1">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                            {team.captain ? `${team.captain.first_name}${team.captain.last_name ? ` ${team.captain.last_name}` : ''}` : 'Sin capitán asignado'}
                                        </p>
                                    </div>

                                    {/* Botón para ver/gestionar el roster del equipo directamente desde aquí */}
                                    <Link
                                        href={route('tenant.teams.edit', {
                                            tenant: currentTenant.slug,
                                            league: league.slug,
                                            tournament: tournament.slug,
                                            team: team.slug
                                        })}
                                        className="mt-4 w-full text-center text-xs font-semibold text-indigo-600 border border-indigo-200 py-1.5 rounded hover:bg-indigo-50 transition"
                                    >
                                        Ver Jugadores
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <div className="flex justify-between items-center mb-6 border-b pb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                            Calendario de Partidos ({matches?.length || 0})
                        </h3>
                        <Link
                            href={route('tenant.matches.index', {
                                tenant: currentTenant.slug,
                                league: league.slug,
                                tournament: tournament.slug
                            })}
                            className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                            Ver todos los partidos &rarr;
                        </Link>
                    </div>

                    {!matches || matches.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">No hay partidos programados en este torneo todavía.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            {matches.map((match) => (
                                <div key={match.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center bg-gray-50 hover:bg-white transition duration-150 gap-4">

                                    {/* Fecha y Tipo */}
                                    <div className="text-sm text-gray-500 flex flex-col items-center sm:items-start min-w-[120px]">
                                        <span className="font-semibold text-gray-700">
                                            {new Date(match.match_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="text-xs uppercase bg-gray-200 px-2 py-0.5 rounded mt-1">
                                            {match.match_type.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {/* Equipos y Marcador (Si existe) */}
                                    <div className="flex items-center space-x-4 flex-grow justify-center">
                                        <div className="text-right font-bold text-gray-900 w-1/3">
                                            {match.local_team?.name || 'Local'}
                                        </div>
                                        <div className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-lg flex items-center justify-center min-w-[70px]">
                                            {match.status === 'completed'
                                                ? `${match.local_score} - ${match.visitor_score}`
                                                : 'VS'
                                            }
                                        </div>
                                        <div className="text-left font-bold text-gray-900 w-1/3">
                                            {match.visitor_team?.name || 'Visitante'}
                                        </div>
                                    </div>

                                    {/* Estado */}
                                    <div className="min-w-[100px] text-right">
                                        {match.status === 'scheduled' && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Programado</span>}
                                        {match.status === 'completed' && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Finalizado</span>}
                                        {match.status === 'canceled' && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Cancelado</span>}
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