import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

// --- Imports de Firebase ---
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// --- Imports de Componentes ---
import SEO from '../components/SEO';
import BarraProgreso from '../components/pedido/ui/BarraProgreso';
import Paso1Cliente from '../components/pedido/pasos/Paso1Cliente';
import Paso2Prendas from '../components/pedido/pasos/Paso2Prendas';
import Paso3Personalizacion from '../components/pedido/pasos/Paso3Personalizacion';
import Paso4Confirmacion from '../components/pedido/pasos/Paso4Confirmacion';
import MensajeFinal from '../components/pedido/MensajeFinal';

const Pedido = () => {
    // El estado y las funciones de navegación no cambian
    const [pasoActual, setPasoActual] = useState(1);
    const [formData, setFormData] = useState({
        cliente: { nombre: '', empresa: '', email: '', whatsapp: '', cuitDni: '' },
        prendas: [],
        personalizacion: { tieneDiseno: 'no', archivo: null, tipoTrabajo: '', ubicacion: '', tamano: '' },
        aceptaTerminos: false,
    });
    const [errores, setErrores] = useState({});
    const [estadoEnvio, setEstadoEnvio] = useState('inicial');
    const [direccionAnimacion, setDireccionAnimacion] = useState(1);
    const [pedidoIdGenerado, setPedidoIdGenerado] = useState(null);

    const handleChange = (seccion, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            [seccion]: { ...prev[seccion], [campo]: valor }
        }));
        if (errores[campo]) {
            const nuevosErrores = { ...errores };
            delete nuevosErrores[campo];
            setErrores(nuevosErrores);
        }
    };

    const validarPaso = () => {
        const nuevosErrores = {};
        if (pasoActual === 1) {
            if (!formData.cliente.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
            if (!formData.cliente.email.trim()) nuevosErrores.email = 'El email es obligatorio.';
            else if (!/\S+@\S+\.\S+/.test(formData.cliente.email)) nuevosErrores.email = 'El formato del email es inválido.';
            if (!formData.cliente.whatsapp.trim()) nuevosErrores.whatsapp = 'El WhatsApp es obligatorio.';
        }
        if (pasoActual === 2) {
            if (formData.prendas.length === 0) nuevosErrores.prendas = 'Debes agregar al menos una combinación de prenda.';
        }
        if (pasoActual === 3) {
            if (formData.personalizacion.tieneDiseno === 'si' && !formData.personalizacion.tipoTrabajo) {
                nuevosErrores.tipoTrabajo = 'Debes seleccionar un tipo de trabajo.';
            }
            if (!formData.personalizacion.ubicacion) nuevosErrores.ubicacion = 'Debes seleccionar una ubicación.';
            if (!formData.personalizacion.tamano) nuevosErrores.tamano = 'Debes seleccionar un tamaño.';
        }
        if (pasoActual === 4) {
            if (!formData.aceptaTerminos) nuevosErrores.aceptaTerminos = 'Debes aceptar los términos y condiciones.';
        }
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };
    
    const siguientePaso = () => { if (validarPaso()) { setDireccionAnimacion(1); setPasoActual(p => p < 4 ? p + 1 : p); window.scrollTo(0, 0); } };
    const pasoAnterior = () => { setDireccionAnimacion(-1); setPasoActual(p => p > 1 ? p - 1 : p); window.scrollTo(0, 0); };

    // --- FUNCIÓN DE ENVÍO CON LÍNEA DE DEPURACIÓN ---
    const handleEnviarPedido = async () => {
        if (!validarPaso()) return;
        setEstadoEnvio("enviando");

        try {
            const pedidoData = {
                cliente: formData.cliente.nombre,
                empresa: formData.cliente.empresa || "N/A",
                email: formData.cliente.email,
                whatsapp: formData.cliente.whatsapp,
                cuitDni: formData.cliente.cuitDni || "N/A",
                estado: "Nuevo",
                fecha_creacion: Timestamp.now(),
                fecha_actualizacion: Timestamp.now(),
                responsable: "formulario-web",
                personalizacion: {
                    tieneDiseno: formData.personalizacion.tieneDiseno,
                    tipoTrabajo: formData.personalizacion.tipoTrabajo,
                    ubicacion: formData.personalizacion.ubicacion,
                    tamano: formData.personalizacion.tamano,
                },
            };
            
            // --- LÍNEA DE DEPURACIÓN TEMPORAL ---
            // Esta línea mostrará en la consola del navegador el objeto exacto que se intenta guardar.
            console.log("Objeto que se enviará a Firestore:", pedidoData);
            // ------------------------------------

            const pedidoDocRef = await addDoc(collection(db, "pedidos"), pedidoData);
            setPedidoIdGenerado(pedidoDocRef.id);

            const itemsPromises = formData.prendas.map(p => addDoc(collection(pedidoDocRef, "items"), p));
            const historialPromise = addDoc(collection(pedidoDocRef, "historial"), {
                usuario: "cliente_web",
                accion: "Pedido creado desde formulario.",
                fecha: Timestamp.now(),
            });

            await Promise.all([...itemsPromises, historialPromise]);
            
            const templateParams = {
              to_name: formData.cliente.nombre,
              from_name: "Fénix Indumentaria",
              message: `ID de Pedido: ${pedidoDocRef.id}`,
              to_email: formData.cliente.email,
            };

            const response = await fetch('/.netlify/functions/enviar-presupuesto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateParams }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la respuesta del servidor de notificaciones.');
            }
            
            setEstadoEnvio("exito");

        } catch (error) {
            console.error("Error en el proceso de envío:", error);
            if (error.code === 'permission-denied') {
                console.error("Error de Firestore: La data enviada no cumple con las reglas de seguridad.");
            }
            setEstadoEnvio("error");
        }
    };

    if (estadoEnvio === 'exito') return <MensajeFinal tipo="exito" pedidoId={pedidoIdGenerado} formData={formData} />;
    if (estadoEnvio === 'error') return <MensajeFinal tipo="error" setEstadoEnvio={setEstadoEnvio} />;

    return (
        <>
            <SEO
                title="Solicitar Presupuesto"
                description="Creá tu pedido personalizado de indumentaria laboral en 4 simples pasos."
                ogUrl="/pedido"
            />
            <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans">
                <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 my-8">
                    <h1 className="text-3xl font-bold text-center text-red-700 mb-2">FÉNIX</h1>
                    <p className="text-center text-gray-600 mb-8">Pedido de Indumentaria Personalizada</p>
                    <BarraProgreso pasoActual={pasoActual} />
                    <div className="overflow-x-hidden relative h-auto">
                        <AnimatePresence mode="wait" custom={direccionAnimacion}>
                            <motion.div
                                key={pasoActual}
                                initial={{ x: direccionAnimacion * 100 + '%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -direccionAnimacion * 100 + '%', opacity: 0 }}
                                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                                className="w-full"
                            >
                                {
                                    {
                                        1: <Paso1Cliente formData={formData} handleChange={handleChange} errores={errores} />,
                                        2: <Paso2Prendas formData={formData} setFormData={setFormData} errores={errores} setErrores={setErrores} />,
                                        3: <Paso3Personalizacion formData={formData} handleChange={handleChange} errores={errores} />,
                                        4: <Paso4Confirmacion formData={formData} setFormData={setFormData} errores={errores} />,
                                    }[pasoActual]
                                }
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
                        <motion.button onClick={pasoAnterior} className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={pasoActual === 1 || estadoEnvio === 'enviando'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <ChevronLeft size={20} /> Volver
                        </motion.button>
                        {pasoActual < 4 ? (
                            <motion.button onClick={siguientePaso} className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                Siguiente <ChevronRight size={20} />
                            </motion.button>
                        ) : (
                            <motion.button onClick={handleEnviarPedido} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={estadoEnvio === 'enviando' || !formData.aceptaTerminos} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                {estadoEnvio === 'enviando' ? (
                                    <><Loader className="animate-spin mr-2" size={20} />Enviando...</>
                                ) : ( 'Finalizar y Enviar Pedido' )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pedido;