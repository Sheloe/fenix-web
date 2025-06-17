// Contenido para: src/pages/admin/DashboardQuejas.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Eye, Loader, MessageSquare } from 'lucide-react';
import SEO from '../../components/SEO';

const QuejaRow = ({ queja }) => {
    const navigate = useNavigate();
    const statusColors = {
        'Nuevo': 'bg-red-100 text-red-800',
        'En revisión': 'bg-yellow-100 text-yellow-800',
        'Resuelto': 'bg-green-100 text-green-800',
        'Cerrado': 'bg-gray-100 text-gray-800',
    };

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-6 text-left">{queja.nombreCompleto}</td>
            <td className="py-3 px-6 text-left">{queja.tipoReclamo}</td>
            <td className="py-3 px-6 text-center">
                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${statusColors[queja.estado] || 'bg-gray-100 text-gray-800'}`}>
                    {queja.estado}
                </span>
            </td>
            <td className="py-3 px-6 text-left">{queja.fecha.toDate().toLocaleDateString('es-AR')}</td>
            <td className="py-3 px-6 text-center">
                <button 
                    onClick={() => navigate(`/admin/dashboard/queja/${queja.id}`)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    title="Ver detalle de la queja"
                >
                    <Eye size={18} />
                </button>
            </td>
        </tr>
    );
};

const DashboardQuejas = () => {
    const [quejas, setQuejas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, "quejas"), orderBy("fecha", "desc"));
        
        const unsubscribe = onSnapshot(q, 
            (querySnapshot) => {
                const quejasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuejas(quejasData);
                setLoading(false);
            },
            (error) => {
                console.error("Error al obtener quejas:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };
    
    return (
        <>
            <SEO title="Gestión de Quejas" description="Gestión de quejas de clientes | Fénix" />
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Panel de Quejas y Reclamos</h1>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Ver Pedidos
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-sm text-red-600 hover:text-red-800"
                    >
                        <LogOut size={16} className="mr-2" /> Cerrar Sesión
                    </button>
                </header>
                <main className="p-8">
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <th className="py-3 px-6">Cliente</th>
                                    <th className="py-3 px-6">Tipo de Reclamo</th>
                                    <th className="py-3 px-6 text-center">Estado</th>
                                    <th className="py-3 px-6">Fecha</th>
                                    <th className="py-3 px-6 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8"><Loader className="mx-auto animate-spin" /></td>
                                    </tr>
                                ) : quejas.length > 0 ? (
                                    quejas.map(queja => <QuejaRow key={queja.id} queja={queja} />)
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-gray-500">
                                            <MessageSquare className="mx-auto mb-2" size={32} />
                                            No hay quejas ni reclamos para mostrar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </>
    );
};

export default DashboardQuejas;