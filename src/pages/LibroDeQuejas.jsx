import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Se elimina AnimatePresence que no se usaba
import SEO from '../components/SEO';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Loader, Send, CheckCircle, AlertTriangle, User, Mail, Phone, Hash, MessageSquare, Menu } from 'lucide-react';

// --- Sub-componente para el mensaje de éxito ---
const MensajeExito = ({ reclamoId }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg text-center bg-white p-8 rounded-xl shadow-lg">
            <CheckCircle className="mx-auto text-green-500 h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Reclamo Enviado Correctamente</h2>
            <p className="text-gray-600 mt-2">Gracias por comunicarte con nosotros. Hemos registrado tu reclamo y nos pondremos en contacto a la brevedad.</p>
            <div className="mt-6 p-4 bg-gray-100 rounded-lg border">
                <p className="text-sm text-gray-600">Tu número de seguimiento de reclamo es:</p>
                <p className="text-lg font-mono font-bold text-gray-900 tracking-wider mt-1">{reclamoId}</p>
            </div>
        </motion.div>
    </div>
);

// --- Sub-componente para el mensaje de error ---
const MensajeError = ({ onRetry }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg text-center bg-white p-8 rounded-xl shadow-lg">
            <AlertTriangle className="mx-auto text-red-500 h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Error al Enviar el Reclamo</h2>
            <p className="text-gray-600 mt-2">Hubo un problema al procesar tu solicitud. Por favor, intentá de nuevo más tarde o contactanos por otro medio.</p>
            <button onClick={onRetry} className="mt-6 btn btn-primario">Volver a Intentar</button>
        </motion.div>
    </div>
);


// --- Sub-componentes de UI para el formulario ---
const CampoInput = ({ id, label, type, valor, onChange, error, icono }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icono}</span>
            <input type={type} id={id} name={id} value={valor} onChange={onChange} className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`} />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const CampoSelect = ({ id, label, valor, onChange, error, icono, opciones }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icono}</span>
            <select id={id} value={valor} onChange={onChange} className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`}>
                <option value="">-- Seleccione un motivo --</option>
                {opciones.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const CampoTextarea = ({ id, label, valor, onChange, error, icono }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
        <div className="relative">
            <span className="absolute top-3 left-0 flex items-center pl-3 text-gray-400">{icono}</span>
            <textarea id={id} value={valor} onChange={onChange} rows={5} className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`}></textarea>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


const LibroDeQuejas = () => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        email: '',
        telefono: '',
        tipoReclamo: '',
        idPedidoAsociado: '',
        descripcion: '',
    });
    const [errores, setErrores] = useState({});
    const [estadoEnvio, setEstadoEnvio] = useState('inicial'); // inicial, enviando, exito, error
    const [reclamoId, setReclamoId] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errores[id]) {
            // --- CORRECCIÓN APLICADA AQUÍ ---
            // Se usa el callback de setErrores para acceder al estado previo de forma segura.
            setErrores(prevErrores => {
                const nuevosErrores = { ...prevErrores };
                delete nuevosErrores[id];
                return nuevosErrores;
            });
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formData.nombreCompleto.trim()) nuevosErrores.nombreCompleto = "El nombre es obligatorio.";
        if (!formData.email.trim()) nuevosErrores.email = "El email es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = "El formato del email es inválido.";
        if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio.";
        if (!formData.tipoReclamo) nuevosErrores.tipoReclamo = "Debe seleccionar un tipo de reclamo.";
        if (!formData.descripcion.trim()) nuevosErrores.descripcion = "La descripción del reclamo es obligatoria.";
        
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setEstadoEnvio('enviando');
        try {
            const quejaData = {
                ...formData,
                fecha: Timestamp.now(),
                estado: 'Nuevo',
                leido: false,
            };
            const docRef = await addDoc(collection(db, "quejas"), quejaData);
            setReclamoId(docRef.id);
            setEstadoEnvio('exito');
        } catch (error) {
            console.error("Error al enviar la queja: ", error);
            setEstadoEnvio('error');
        }
    };

    if (estadoEnvio === 'exito') {
        return <MensajeExito reclamoId={reclamoId} />;
    }
    
    if (estadoEnvio === 'error') {
        return <MensajeError onRetry={() => setEstadoEnvio('inicial')} />;
    }

    return (
        <>
            <SEO title="Libro de Quejas Online" description="Canal oficial para el registro de reclamos, quejas o sugerencias de Fénix Indumentaria." ogUrl="/libro-de-quejas" />
            <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h1 className="titulo-principal">Libro de Quejas Online</h1>
                        <p className="mt-2 text-gray-600">Utilice este formulario para registrar formalmente su queja, reclamo o sugerencia.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CampoInput id="nombreCompleto" label="Nombre Completo" type="text" valor={formData.nombreCompleto} onChange={handleChange} error={errores.nombreCompleto} icono={<User size={18} />} />
                            <CampoInput id="email" label="Email de Contacto" type="email" valor={formData.email} onChange={handleChange} error={errores.email} icono={<Mail size={18} />} />
                            <CampoInput id="telefono" label="Teléfono" type="tel" valor={formData.telefono} onChange={handleChange} error={errores.telefono} icono={<Phone size={18} />} />
                            <CampoSelect 
                                id="tipoReclamo" 
                                label="Motivo del Reclamo" 
                                valor={formData.tipoReclamo} 
                                onChange={handleChange} 
                                error={errores.tipoReclamo} 
                                icono={<Menu size={18} />} 
                                opciones={["Pedido incorrecto", "Demora en la entrega", "Calidad del producto", "Atención al cliente", "Otro"]}
                            />
                        </div>
                        <div>
                            <label htmlFor="idPedidoAsociado" className="block text-sm font-medium text-gray-700 mb-1">ID de Pedido (Opcional)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Hash size={18} /></span>
                                <input type="text" id="idPedidoAsociado" value={formData.idPedidoAsociado} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500" />
                            </div>
                        </div>
                        <CampoTextarea id="descripcion" label="Descripción detallada del problema" valor={formData.descripcion} onChange={handleChange} error={errores.descripcion} icono={<MessageSquare size={18} />} />
                        
                        <div className="pt-4">
                            <button type="submit" className="w-full btn btn-primario flex justify-center items-center" disabled={estadoEnvio === 'enviando'}>
                                {estadoEnvio === 'enviando' ? <Loader className="animate-spin mr-2" /> : <Send className="mr-2" />}
                                {estadoEnvio === 'enviando' ? 'Enviando...' : 'Enviar Reclamo'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default LibroDeQuejas;
// LibroDeQuejas.jsx
// Este componente permite a los usuarios registrar quejas, reclamos o sugerencias de forma online.