import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

// Agregamos 'players' a las props
export default function Edit({ auth, team, tournament, league, users, players }) {
    const { currentTenant } = usePage().props;

    // --- FORMULARIO 1: EDITAR EQUIPO ---
    const teamForm = useForm({
        name: team.name || '',
        captain_id: team.captain_id || '',
        is_visible: team.is_visible ? true : false,
    });

    const submitTeam = (e) => {
        e.preventDefault();
        teamForm.put(route('tenant.teams.update', {
            tenant: currentTenant.slug,
            league: league.slug,
            tournament: tournament.slug,
            team: team.slug
        }));
    };

    // --- FORMULARIO 2: AGREGAR JUGADOR ---
    const playerForm = useForm({
        name: '',
        jersey_number: '',
        is_visible: true,
        photo: null // Aún no implementamos la subida de imagen, pero lo dejamos listo
    });

    const submitPlayer = (e) => {
        e.preventDefault();
        playerForm.post(route('tenant.players.store', {
            tenant: currentTenant.slug,
            league: league.slug,
            tournament: tournament.slug,
            team: team.slug
        }), {
            preserveScroll: true, // Evita que la página salte hacia arriba al guardar
            onSuccess: () => playerForm.reset(), // Limpia el formulario si es exitoso
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Gestionar Equipo: {team.name}</h2>}
        >
            <Head title={`Editar ${team.name}`} />

            <div className="py-12 max-w-5xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* COLUMNA IZQUIERDA: DATOS DEL EQUIPO */}
                <div className="bg-white p-6 shadow sm:rounded-lg h-fit">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del Equipo</h3>
                    <form onSubmit={submitTeam} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={teamForm.data.name}
                                onChange={e => teamForm.setData('name', e.target.value)}
                                required
                            />
                            {teamForm.errors.name && <div className="text-red-500 text-sm">{teamForm.errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capitán</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={teamForm.data.captain_id}
                                onChange={e => teamForm.setData('captain_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.first_name} {u.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                checked={teamForm.data.is_visible}
                                onChange={e => teamForm.setData('is_visible', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">Equipo Público</span>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={teamForm.processing}
                                className="bg-indigo-600 py-2 px-4 text-sm font-medium text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Guardar Equipo
                            </button>
                        </div>
                    </form>
                </div>

                {/* COLUMNA DERECHA: JUGADORES */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Roster de Jugadores</h3>

                    {/* Formulario para agregar jugador */}
                    <form onSubmit={submitPlayer} className="mb-6 flex gap-2 items-start">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Nombre del jugador"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 sm:text-sm"
                                value={playerForm.data.name}
                                onChange={e => playerForm.setData('name', e.target.value)}
                                required
                            />
                            {playerForm.errors.name && <div className="text-red-500 text-xs mt-1">{playerForm.errors.name}</div>}
                        </div>
                        <div className="w-20">
                            <input
                                type="number"
                                placeholder="No."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 sm:text-sm"
                                value={playerForm.data.jersey_number}
                                onChange={e => playerForm.setData('jersey_number', e.target.value)}
                                required
                            />
                            {playerForm.errors.jersey_number && <div className="text-red-500 text-xs mt-1">{playerForm.errors.jersey_number}</div>}
                        </div>
                        <button
                            type="submit"
                            disabled={playerForm.processing}
                            className="bg-gray-800 py-2 px-4 text-sm font-medium text-white rounded-md shadow-sm hover:bg-gray-900 disabled:opacity-50"
                        >
                            Agregar
                        </button>
                    </form>

                    {/* Lista de Jugadores */}
                    <ul className="divide-y divide-gray-200 border-t border-gray-200">
                        {players && players.length > 0 ? (
                            players.map(player => (
                                <li key={player.id} className="py-3 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="font-bold text-gray-500 mr-3 w-6">{player.jersey_number}</span>
                                        <span className="text-sm font-medium text-gray-900">{player.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {player.is_visible ? 'Público' : 'Oculto'}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="py-4 text-sm text-gray-500 text-center">
                                No hay jugadores registrados aún.
                            </li>
                        )}
                    </ul>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}