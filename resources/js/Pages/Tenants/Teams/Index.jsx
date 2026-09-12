import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';

export default function Index({ auth, teams, tournaments , users }) {
    const { currentTenant } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        tournament_id: '',
        captain_id: '',
        logo: null,
        is_visible: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tenant.teams.store', { tenant: currentTenant.slug }), {
            onSuccess: () => reset('name', 'logo'), // Reseteamos el nombre y logo, dejamos torneo y capitán por si quiere registrar varios rápido
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Equipos Registrados</h2>}
        >
            <Head title="Equipos" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                {/* Formulario de Creación */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Inscribir Nuevo Equipo</h3>

                    {tournaments.length === 0 || users.length === 0 ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="text-sm text-yellow-700">
                                Para inscribir un equipo necesitas tener al menos un <strong>Torneo Activo</strong> y un <strong>Capitán</strong> registrado.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                {/* Torneo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Torneo</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={data.tournament_id}
                                        onChange={e => setData('tournament_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        {tournaments.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    {errors.tournament_id && <div className="text-red-500 text-sm">{errors.tournament_id}</div>}
                                </div>

                                {/* Capitán */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Asignar Capitán</label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={data.captain_id}
                                            onChange={e => setData('captain_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccionar usuario global...</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.first_name} {u.last_name} ({u.email}) {u.role === 'captain' ? ' - Ya es Capitán' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Si el usuario tiene rol "user", se actualizará a "captain" en toda la plataforma.
                                        </p>
                                        {errors.captain_id && <div className="text-red-500 text-sm">{errors.captain_id}</div>}
                                    </div>

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

                                {/* Logo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Escudo / Logo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        onChange={e => setData('logo', e.target.files[0])}
                                    />
                                    {errors.logo && <div className="text-red-500 text-sm">{errors.logo}</div>}
                                </div>

                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                        checked={data.is_visible}
                                        onChange={e => setData('is_visible', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Equipo Público</span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-auto inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Inscribir Equipo
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Lista de Equipos */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Equipos Actuales</h3>

                    {teams.length === 0 ? (
                        <p className="text-gray-500">Aún no hay equipos inscritos.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((team) => (
                                <div key={team.id} className="border rounded-lg p-4 flex items-center space-x-4">
                                    {team.logo ? (
                                        <img src={`/storage/${team.logo}`} alt={team.name} className="w-16 h-16 rounded-full object-cover border" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                                            {team.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="text-md font-bold text-gray-900">{team.name}</h4>
                                        <p className="text-xs text-gray-500">🏆 {team.tournament?.name}</p>
                                        <p className="text-xs text-gray-500">👤 {team.captain?.first_name} {team.captain?.last_name}</p>

                                        <div className="mt-2 flex space-x-3 text-sm">
                                            <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('¿Eliminar equipo? Esto afectará los partidos programados.')) {
                                                        router.delete(route('tenant.teams.destroy', { tenant: currentTenant.slug, team: team.id }));
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
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