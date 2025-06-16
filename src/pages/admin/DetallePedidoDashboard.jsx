import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, onSnapshot, collection, query, orderBy, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
// --- CORRECCIÓN: Se añade 'Clock' y se optimizan las importaciones ---
import { Loader, AlertTriangle, User, Mail, Phone, ShoppingCart, ListChecks, Save, ArrowLeft, Clock } from 'lucide-react';

// --- SUB-COMPONENTE: Información del Pedido (Mejorado con Iconos) ---
const InfoPedido = ({ pedido }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border col-span-1 md:col-span-2">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pedido #{pedido.id.substring(0, 7).toUpperCase()}</h1>
                <p className="text-sm text-gray-500">Recibido el: {new Date(pedido.fecha_creacion.seconds * 1000).toLocaleDateString('es-AR')}</p>
            </div>
            <span className="py-1 px-4 rounded-full text-sm font-bold bg-blue-100 text-blue-800">{pedido.estado}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-6">
            <div>
                <h3 className="font-bold text-lg mb-2 flex items-center"><User size={20} className="mr-2"/>Datos del Cliente</h3>
                <div className="space-y-2">
                    <p><strong>Nombre:</strong> {pedido.cliente}</p>
                    <p className="flex items-center"><Mail size={14} className="mr-2 text-gray-500" /> <a href={`mailto:${pedido.email}`} className="text-red-600 hover:underline">{pedido.email}</a></p>
                    <p className="flex items-center"><Phone size={14} className="mr-2 text-gray-500" /> <a href={`https://wa.me/${pedido.whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{pedido.whatsapp}</a></p>
                    {pedido.empresa && <p><strong>Empresa:</strong> {pedido.empresa}</p>}
                    {pedido.cuitDni && <p><strong>CUIT/DNI:</strong> {pedido.cuitDni}</p>}
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-2 flex items-center"><ShoppingCart size={20} className="mr-2"/>Items Solicitados</h3>
                <ul className="list-disc list-inside space-y-1">
                    {pedido.items && pedido.items.map((item, i) => <li key={i}>{item.cantidad}x {item.prenda} ({item.talle}, {item.color})</li>)}
                </ul>
            </div>
        </div>
    </div>
);

// --- SUB-COMPONENTE: Gestión del Pedido ---
const GestionPedido = ({ estadoActual, onEstadoChange, nota, onNotaChange, onGuardar, loading }) => {
    const estadosPedido = ["Nuevo", "En presupuesto", "Aprobado", "En producción", "Listo para retirar", "Entregado", "Cancelado"];
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Gestionar Pedido</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Actualizar Estado del Pedido</label>
                    <select id="estado" value={estadoActual} onChange={onEstadoChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                        {estadosPedido.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="notaInterna" className="block text-sm font-medium text-gray-700">Agregar Nota Interna al Historial</label>
                    <textarea id="notaInterna" value={nota} onChange={onNotaChange} rows="4" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
                </div>
                <button onClick={onGuardar} disabled={loading} className="w-full btn btn-primario flex items-center justify-center">
                    {loading ? <Loader className="animate-spin mr-2" /> : <Save className="mr-2" />}
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: Historial del Pedido ---
const HistorialPedido = ({ historial }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-8 col-span-1 md:col-span-3">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center"><ListChecks size={20} className="mr-2"/>Historial de Acciones</h3>
        <div className="flow-root">
            <ul className="-mb-8">
                {historial.map((item, index) => (
                    <li key={item.id}>
                        <div className="relative pb-8">
                            {index !== historial.length - 1 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />}
                            <div className="relative flex space-x-3">
                                <div><span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white"><Clock className="h-5 w-5 text-white" /></span></div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                        <p className="text-sm text-gray-500">{item.accion}</p>
                                        {item.nota && <p className="text-sm italic text-gray-800 bg-gray-100 p-2 rounded-md mt-1">"{item.nota}"</p>}
                                    </div>
                                    <div className="text-right text-xs whitespace-nowrap text-gray-500">
                                        <time>{new Date(item.fecha.seconds * 1000).toLocaleString('es-AR')}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
const DetallePedidoDashboard = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [pedido, setPedido] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nuevoEstado, setNuevoEstado] = useState('');
    const [nuevaNota, setNuevaNota] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!pedidoId) return;

        const unsubDoc = onSnapshot(doc(db, "pedidos", pedidoId), (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                setPedido(data);
                setNuevoEstado(data.estado);
            } else {
                setError("No se encontró el pedido.");
            }
            setLoading(false);
        }, (err) => { setError("Error al cargar el pedido."); setLoading(false); });

        const itemsQuery = query(collection(db, "pedidos", pedidoId, "items"));
        const unsubItems = onSnapshot(itemsQuery, (snapshot) => {
            setPedido(prev => (prev ? {...prev, items: snapshot.docs.map(d => d.data())} : null));
        });

        const historialQuery = query(collection(db, "pedidos", pedidoId, "historial"), orderBy("fecha", "desc"));
        const unsubHistorial = onSnapshot(historialQuery, (snapshot) => {
            setHistorial(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => { unsubDoc(); unsubItems(); unsubHistorial(); };
    }, [pedidoId]);

    const handleGuardarCambios = async () => {
        if (!user) return alert("Error: No se ha identificado al usuario.");
        setSaving(true);
        const pedidoRef = doc(db, "pedidos", pedidoId);
        try {
            await updateDoc(pedidoRef, { estado: nuevoEstado, fecha_actualizacion: Timestamp.now() });
            const historialText = `Estado cambiado a "${nuevoEstado}" por ${user.email.split('@')[0]}.`;
            await addDoc(collection(pedidoRef, "historial"), {
                accion: historialText,
                nota: nuevaNota,
                fecha: Timestamp.now(),
                usuario: user.email
            });
            setNuevaNota('');
        } catch (err) {
            console.error("Error al guardar cambios:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-red-600" size={48} /></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-screen p-4 text-center"><AlertTriangle className="text-red-500 mb-4" size={48} /><h3 className="text-xl font-bold text-red-800">Ocurrió un Error</h3><p className="text-red-700">{error}</p></div>;

    return (
        <>
            <SEO title={`Detalle Pedido #${pedidoId ? pedidoId.substring(0,7) : ''}`} />
            <div className="bg-gray-50 min-h-screen">
                 <header className="bg-white shadow-sm p-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-sm text-red-600 hover:underline">
                        <ArrowLeft size={16} className="mr-2"/> Volver al Listado de Pedidos
                    </button>
                </header>
                <main className="p-4 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {pedido && <InfoPedido pedido={pedido} />}
                        <GestionPedido
                            estadoActual={nuevoEstado}
                            onEstadoChange={(e) => setNuevoEstado(e.target.value)}
                            nota={nuevaNota}
                            onNotaChange={(e) => setNuevaNota(e.target.value)}
                            onGuardar={handleGuardarCambios}
                            loading={saving}
                        />
                        {historial.length > 0 && <HistorialPedido historial={historial} />}
                    </div>
                </main>
            </div>
        </>
    );
};

export default DetallePedidoDashboard;
// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';