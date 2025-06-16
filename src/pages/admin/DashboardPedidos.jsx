import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Eye, Loader, Inbox } from 'lucide-react';
import SEO from '../../components/SEO';


const PedidoRow = ({ pedido }) => {
    const navigate = useNavigate();
    const statusColors = {
        'Nuevo': 'bg-blue-100 text-blue-800',
        'En producción': 'bg-yellow-100 text-yellow-800',
        'Entregado': 'bg-green-100 text-green-800',
        'Aprobado': 'bg-teal-100 text-teal-800',
        'En presupuesto': 'bg-indigo-100 text-indigo-800',
        'Listo para retirar': 'bg-purple-100 text-purple-800',
    };

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-6 text-left font-mono text-sm text-gray-600">#{pedido.id.substring(0, 7).toUpperCase()}</td>
            <td className="py-3 px-6 text-left">{pedido.cliente}</td>
            <td className="py-3 px-6 text-center">
                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${statusColors[pedido.estado] || 'bg-gray-100 text-gray-800'}`}>
                    {pedido.estado}
                </span>
            </td>
            <td className="py-3 px-6 text-left">{pedido.fecha_creacion.toDate().toLocaleDateString('es-AR')}</td>
            <td className="py-3 px-6 text-center">
                <button 
                    onClick={() => navigate(`/admin/dashboard/pedido/${pedido.id}`)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    title="Ver detalle"
                >
                    <Eye size={18} />
                </button>
            </td>
        </tr>
    );
};

const DashboardPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, "pedidos"), orderBy("fecha_creacion", "desc"));
        const unsubscribe = onSnapshot(q, 
            (querySnapshot) => {
                const pedidosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPedidos(pedidosData);
                setLoading(false);
            },
            (error) => {
                console.error("Error al obtener pedidos:", error);
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

        <SEO title="Gestión de Reclamos" description="Gestión de reclamos de clientes | Fénix" />
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                 <h1 className="text-2xl font-bold text-gray-800">Panel de Pedidos</h1>
                 <button
                     onClick={() => navigate('/admin/dashboard/quejas')}
                     className="text-sm text-red-600 hover:underline"
                 >
                        Ver Quejas
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
                                <th className="py-3 px-6">ID Pedido</th>
                                <th className="py-3 px-6">Cliente</th>
                                <th className="py-3 px-6 text-center">Estado</th>
                                <th className="py-3 px-6">Fecha</th>
                                <th className="py-3 px-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center p-8">
                                <Loader className="mx-auto animate-spin" />
                                </td>
                            </tr>
                            ) : pedidos.length > 0 ? (
                            pedidos.map(pedido => <PedidoRow key={pedido.id} pedido={pedido} />)
                            ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-8 text-gray-500">
                                <Inbox className="mx-auto mb-2" size={32} />
                                No hay pedidos para mostrar.
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

export default DashboardPedidos;
// Aquí irían los componentes visuales para mostrar la información,
// podríamos reutilizar y adaptar los del Seguimiento.jsx