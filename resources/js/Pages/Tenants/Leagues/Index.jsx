import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Index({ auth, leagues }) {
    const { currentTenant } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tenant.leagues.store', { tenant: currentTenant.slug }), {
            onSuccess: () => reset(), // Limpiamos el formulario al guardar
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Ligas de {currentTenant.name}</h2>}
        >
            <Head title="Mis Ligas" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                {/* Formulario de Creación */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nueva Liga</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre de la Liga</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Guardar Liga
                        </button>
                    </form>
                </div>

                {/* Lista de Ligas Guardadas */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ligas Activas</h3>

                    {leagues.length === 0 ? (
                        <p className="text-gray-500">Aún no hay ligas registradas en esta cancha.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {leagues.map((league) => (
                                <li key={league.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900">{league.name}</p>
                                            {league.status === 'inactive' && (
                                                <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Inactiva</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{league.description || 'Sin descripción'}</p>
                                        <p className="text-sm text-gray-500">{league.slug || 'Sin slug'}</p>
                                    </div>

                                    <Link
                                        href={route('tenant.leagues.edit', { tenant: currentTenant.slug, league: league.id })}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Editar
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}