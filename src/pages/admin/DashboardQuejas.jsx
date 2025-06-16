import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
// 1. Se añade 'Timestamp' a la importación y se eliminan los que no se usan.
import { doc, collection, addDoc, updateDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
import { Loader, AlertTriangle, User, Mail, Phone, MessageSquare, Hash, BookOpen, Clock, Save, ArrowLeft } from 'lucide-react';

// --- SUB-COMPONENTE: Muestra los detalles del cliente y la queja (Optimizado) ---
const InfoReclamo = ({ queja }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Detalle del Reclamo</h2>
        <div className="space-y-4 text-sm">
            <div className="flex items-center"><User size={16} className="text-gray-500 mr-3 flex-shrink-0" /><p><strong>Nombre:</strong> {queja.nombreCompleto}</p></div>
            <div className="flex items-center"><Mail size={16} className="text-gray-500 mr-3 flex-shrink-0" /><p><strong>Email:</strong> <a href={`mailto:${queja.email}`} className="text-red-600 hover:underline">{queja.email}</a></p></div>
            <div className="flex items-center"><Phone size={16} className="text-gray-500 mr-3 flex-shrink-0" /><p><strong>Teléfono:</strong> <a href={`https://wa.me/${queja.telefono.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{queja.telefono}</a></p></div>
            <div className="flex items-center"><BookOpen size={16} className="text-gray-500 mr-3 flex-shrink-0" /><p><strong>Tipo de Reclamo:</strong> {queja.tipoReclamo}</p></div>
            {queja.idPedidoAsociado && <div className="flex items-center"><Hash size={16} className="text-gray-500 mr-3 flex-shrink-0" /><p><strong>ID Pedido Asociado:</strong> {queja.idPedidoAsociado}</p></div>}
            
            <div className="border-t pt-4 mt-4">
                 <div className="flex items-start">
                    <MessageSquare size={16} className="text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-semibold">Descripción del problema:</p>
                        <p className="mt-1 text-gray-700">{queja.descripcion}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- SUB-COMPONENTE: Formulario para gestionar el reclamo ---
const FormularioGestion = ({ estado, setEstado, nota, setNota, onSubmit, loading }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gestionar Reclamo</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Cambiar Estado</label>
                <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                    <option>Nuevo</option>
                    <option>En revisión</option>
                    <option>Resuelto</option>
                    <option>Cerrado</option>
                </select>
            </div>
            <div>
                <label htmlFor="notaInterna" className="block text-sm font-medium text-gray-700">Agregar Nota Interna (Opcional)</label>
                <textarea id="notaInterna" value={nota} onChange={(e) => setNota(e.target.value)} rows="4" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
                <p className="text-xs text-gray-500 mt-1">Esta nota se guardará en el historial y no es visible para el cliente.</p>
            </div>
            <button onClick={onSubmit} disabled={loading} className="w-full btn btn-primario flex items-center justify-center">
                {loading ? <Loader className="animate-spin mr-2" /> : <Save className="mr-2" />}
                {loading ? 'Guardando...' : 'Guardar Cambios y Añadir Nota'}
            </button>
        </div>
    </div>
);

// --- SUB-COMPONENTE: Historial de acciones sobre el reclamo ---
const HistorialReclamo = ({ historial }) => (
    <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Historial de Acciones</h3>
        <div className="flow-root">
            <ul className="-mb-8">
                {historial.map((item, index) => (
                    <li key={item.id}>
                        <div className="relative pb-8">
                            {index !== historial.length - 1 ? <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" /> : null}
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
                {historial.length === 0 && <p className="text-sm text-gray-500">Aún no hay acciones en este reclamo.</p>}
            </ul>
        </div>
    </div>
);

// --- SUB-COMPONENTE: Guía de Uso ---
const GuiaDeUso = () => (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex">
            <div className="flex-shrink-0"><BookOpen className="h-5 w-5 text-blue-500" /></div>
            <div className="ml-3">
                <h3 className="text-lg font-bold text-blue-800">Guía de Uso</h3>
                <div className="mt-2 text-sm text-blue-700 space-y-2">
                    <p><strong>1. Cambiar Estado:</strong> Seleccioná el nuevo estado del reclamo para reflejar su progreso.</p>
                    <p><strong>2. Agregar Nota:</strong> Escribí un comentario interno con detalles de la gestión (ej: "Se contactó al cliente por WhatsApp").</p>
                    <p><strong>3. Guardar:</strong> El botón guardará el nuevo estado y la nota en una única entrada en el historial, dejando un registro claro de la acción.</p>
                </div>
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
const DetalleQuejaDashboard = () => {
    const { quejaId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [queja, setQueja] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nuevoEstado, setNuevoEstado] = useState('');
    const [nuevaNota, setNuevaNota] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!quejaId) return;

        const unsubDoc = onSnapshot(doc(db, "quejas", quejaId), (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                setQueja(data);
                setNuevoEstado(data.estado);
            } else {
                setError("No se encontró el reclamo.");
            }
            setLoading(false);
        }, (err) => {
            console.error("Error al obtener queja:", err);
            setError("Error al cargar el reclamo.");
            setLoading(false);
        });

        const historialQuery = query(collection(db, "quejas", quejaId, "historial"), orderBy("fecha", "desc"));
        const unsubHistorial = onSnapshot(historialQuery, (snapshot) => {
            setHistorial(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubDoc();
            unsubHistorial();
        };
    }, [quejaId]);

    const handleGuardarCambios = async () => {
        if (!user) {
            alert("Error: No se ha identificado al usuario administrador.");
            return;
        }
        setSaving(true);
        const quejaRef = doc(db, "quejas", quejaId);
        
        try {
            await updateDoc(quejaRef, {
                estado: nuevoEstado,
                leido: true
            });

            await addDoc(collection(quejaRef, "historial"), {
                accion: `Estado cambiado a "${nuevoEstado}" por ${user.email.split('@')[0]}.`,
                nota: nuevaNota,
                fecha: Timestamp.now(), // <-- Ahora 'Timestamp' está definido.
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
            <SEO title={`Detalle Reclamo #${quejaId ? quejaId.substring(0,7) : ''}`} />
            <div className="bg-gray-50 min-h-screen">
                 <header className="bg-white shadow-sm p-4">
                    <button onClick={() => navigate('/admin/dashboard/quejas')} className="flex items-center text-sm text-red-600 hover:underline">
                        <ArrowLeft size={16} className="mr-2"/> Volver al Listado de Reclamos
                    </button>
                </header>

                <main className="p-4 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <div className="lg:col-span-2 space-y-8">
                            {queja && <InfoReclamo queja={queja} />}
                            {historial && <HistorialReclamo historial={historial} />}
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                           <FormularioGestion
                                estado={nuevoEstado}
                                setEstado={setNuevoEstado}
                                nota={nuevaNota}
                                setNota={setNuevaNota}
                                onSubmit={handleGuardarCambios}
                                loading={saving}
                           />
                           <GuiaDeUso />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default DetalleQuejaDashboard;
// Nota: Este componente asume que el contexto de autenticación y la configuración de Firebase están correctamente configurados en tu aplicación.
// Este componente DetalleQuejaDashboard muestra los detalles de un reclamo específico, permite gestionar su estado y agregar notas internas.