import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ auth, league }) {
    const { currentTenant } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: league.name || '',
        description: league.description || '',
        status: league.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        // Usamos PUT para actualizar, pasando el slug del tenant y el id de la liga
        put(route('tenant.leagues.update', { tenant: currentTenant.slug, league: league.id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Editar Liga: {league.name}</h2>}
        >
            <Head title={`Editar ${league.name}`} />

            <div className="py-12 max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 shadow sm:rounded-lg">

                    <form onSubmit={submit} className="space-y-6">
                        {/* Nombre */}
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

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                        {/* Selector de Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado de la Liga</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                            >
                                <option value="active">Activa</option>
                                <option value="inactive">Inactiva / Pausada</option>
                            </select>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-4 mt-6">
                            <Link
                                href={route('tenant.leagues.index', { tenant: currentTenant.slug })}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
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