import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    // 1. Extraemos los props globales que inyectó nuestro Middleware
    const { currentTenant } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Panel de Administración: {currentTenant.name}
                </h2>
            }
        >
            <Head title={`Dashboard - ${currentTenant.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                ¡Bienvenido a tu Complejo Deportivo!
                            </h3>

                            <p className="mb-6 text-gray-600">
                                Si estás viendo esta pantalla, significa que el Middleware leyó la URL exitosamente y cargó los datos reales de tu base de datos mediante Inertia.
                            </p>

                            {/* Caja de depuración para ver los datos reales del Tenant */}
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-gray-700 mb-2">
                                    Datos inyectados por el Middleware:
                                </h4>
                                <ul className="space-y-2 font-mono text-sm text-gray-800">
                                    <li><strong>ID:</strong> {currentTenant.id}</li>
                                    <li><strong>Nombre:</strong> {currentTenant.name}</li>
                                    <li><strong>Slug (URL actual):</strong> {currentTenant.slug}</li>
                                    <li><strong>Plan:</strong> {currentTenant.plan}</li>
                                    <li><strong>Estado:</strong> <span className="text-green-600">{currentTenant.status}</span></li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}