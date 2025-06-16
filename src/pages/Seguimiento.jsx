import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // <-- LÍNEA ACTUALIZADA
import { Search, Loader, AlertCircle, CheckCircle, Package, Truck, Wrench, RefreshCw, ClipboardCheck, DollarSign, FileText, Palette, Ruler, User, Mail } from 'lucide-react';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

// --- CONTENEDOR PRINCIPAL DEL RESULTADO ---
const ResultadoPedido = ({ pedido, onReset }) => (
    <motion.div
        key={pedido.pedidoId} // Usar el ID del pedido como key
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-8 w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200" // Añadir estilo aquí para cada tarjeta de pedido
    >
        {/* Encabezado con los datos principales */}
        <div className="bg-gray-800 text-white p-6 rounded-t-lg shadow-inner flex justify-between items-center -mx-6 -mt-6 mb-6"> {/* Ajuste de bordes */}
            <div>
                <p className="text-sm text-gray-400">CLIENTE: {pedido.cliente}</p>
                <h2 className="text-3xl font-bold tracking-wider">PEDIDO #{pedido.pedidoId.substring(0, 7).toUpperCase()}</h2>
            </div>
            <p className="text-lg font-semibold bg-red-600 px-3 py-1 rounded-md">{pedido.estado}</p>
        </div>

        {/* La barra de progreso visual */}
        <BarraDeProgreso pedido={pedido} />

        {/* Grid para mostrar los detalles y el historial */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            <div className="lg:col-span-2">
                <ResumenProductos pedido={pedido} />
                <InfoAdicional pedido={pedido} />
            </div>
            <div className="lg:col-span-1">
                <TimelineHistorial historial={pedido.historial} />
            </div>
        </div>
        {/* El botón de resetear busqueda ahora va en el componente padre cuando hay múltiples resultados */}
    </motion.div>
);

// --- BARRA DE PROGRESO (Estilo refinado) ---
const BarraDeProgreso = ({ pedido }) => {
    const etapas = [
        { nombre: 'Pedido recibido', icon: <Package /> }, { nombre: 'En presupuesto', icon: <DollarSign /> },
        { nombre: 'Aprobado', icon: <ClipboardCheck /> }, { nombre: 'En producción', icon: <Wrench /> },
        { nombre: 'Listo para retirar', icon: <Truck /> }, { nombre: 'Entregado', icon: <CheckCircle /> }
    ];
    const indiceActual = Math.max(0, etapas.findIndex(e => e.nombre === pedido.estado));

    return (
        <div className="w-full">
            <div className="flex items-center justify-between"> {/* Ajuste para distribuir los íconos */}
                {etapas.map((etapa, index) => (
                    <React.Fragment key={etapa.nombre}>
                        <div className="flex flex-col items-center text-center flex-1 min-w-[70px] px-1"> {/* Flex-1 para distribución igual */}
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full z-10 transition-all duration-500 ${index <= indiceActual ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                {React.cloneElement(etapa.icon, { size: 24 })}
                            </div>
                            <p className="text-xs mt-2 text-gray-600 hidden sm:block">{etapa.nombre}</p> {/* Ocultar en móviles pequeños */}
                        </div>
                        {index < etapas.length - 1 && (
                            <div className="flex-auto border-t-4 h-1 transition-all duration-500 mx-1" style={{ borderColor: index < indiceActual ? '#DC2626' : '#E5E7EB' }}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// --- NUEVO COMPONENTE: LÍNEA DE TIEMPO VERTICAL ---
const TimelineHistorial = ({ historial }) => (
    <div className="bg-gray-50 p-4 rounded-lg h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Cambios</h3>
        <div className="relative pl-4 border-l-2 border-gray-200">
            <AnimatePresence>
                {historial.map((evento, index) => (
                    <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="mb-6 relative"
                    >
                        <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full ${index === historial.length - 1 ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <p className="font-semibold text-gray-700">{evento.accion}</p>
                        <p className="text-xs text-gray-500">{evento.fecha.toDate().toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} hs</p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    </div>
);

// --- NUEVO COMPONENTE: RESUMEN DE PRODUCTOS ---
const ResumenProductos = ({ pedido }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Productos Solicitados</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {pedido.items.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex justify-between items-center border-b border-gray-200 pb-2"
                >
                    <p className="text-gray-800"><span className="font-bold text-red-600">{item.cantidad}x</span> {item.prenda}</p>
                    <p className="text-sm text-gray-500">Talle: {item.talle} / Color: {item.color}</p>
                </motion.div>
            ))}
        </div>
    </div>
);

// --- NUEVO COMPONENTE: INFO DE PERSONALIZACIÓN ---
const InfoAdicional = ({ pedido }) => (
    <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalles de Personalización</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <FileText className="text-red-600 mb-2" />
                <p className="text-xs text-gray-500">Tipo</p>
                <p className="font-semibold">{pedido.personalizacion.tipoTrabajo}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <Palette className="text-red-600 mb-2" />
                <p className="text-xs text-gray-500">Ubicación</p>
                <p className="font-semibold">{pedido.personalizacion.ubicacion}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <Ruler className="text-red-600 mb-2" />
                <p className="text-xs text-gray-500">Tamaño</p>
                <p className="font-semibold">{pedido.personalizacion.tamano}</p>
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL: SEGUIMIENTO ---
const Seguimiento = () => {
    const [inputBusqueda, setInputBusqueda] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('codigo'); // 'codigo', 'nombre', 'email'
    const [pedidosEncontrados, setPedidosEncontrados] = useState([]); // Ahora un array para múltiples pedidos
    const [estadoBusqueda, setEstadoBusqueda] = useState('inicial');
    const [mensajeError, setMensajeError] = useState('');

    const handleBuscarPedido = async (e) => {
        e.preventDefault();
        if (!inputBusqueda.trim()) return; // Usar .trim() para evitar búsquedas vacías

        setEstadoBusqueda('buscando');
        setPedidosEncontrados([]); // Limpiar pedidos anteriores
        setMensajeError('');

        try {
            let pedidosSnapshot;
            let pedidosList = [];

            if (tipoBusqueda === 'codigo') {
                const docRef = doc(db, "pedidos", inputBusqueda.trim());
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    pedidosList.push(docSnap);
                }
            } else { // tipoBusqueda === 'nombre' || tipoBusqueda === 'email'
                const fieldToQuery = tipoBusqueda === 'nombre' ? 'cliente' : 'email';
                const q = query(collection(db, "pedidos"), where(fieldToQuery, "==", inputBusqueda.trim().toLowerCase())); // Usar toLowerCase para búsqueda insensible a mayúsculas
                pedidosSnapshot = await getDocs(q);
                pedidosList = pedidosSnapshot.docs;
            }

            if (pedidosList.length > 0) {
                const fetchedPedidos = await Promise.all(
                    pedidosList.map(async (docSnap) => {
                        const itemsRef = collection(db, "pedidos", docSnap.id, "items");
                        const historialRef = collection(db, "pedidos", docSnap.id, "historial");
                        const qHistorial = query(historialRef, orderBy("fecha", "asc"));

                        const [itemsSnap, historialSnap] = await Promise.all([getDocs(itemsRef), getDocs(qHistorial)]);

                        const itemsData = itemsSnap.docs.map(itemDoc => itemDoc.data());
                        const historialData = historialSnap.docs.map(historialDoc => historialDoc.data());

                        return {
                            pedidoId: docSnap.id,
                            ...docSnap.data(),
                            items: itemsData,
                            historial: historialData,
                        };
                    })
                );
                setPedidosEncontrados(fetchedPedidos);
                setEstadoBusqueda('encontrado');
            } else {
                setEstadoBusqueda('noEncontrado');
            }
        } catch (error) {
            console.error("Error al buscar el pedido(s):", error);
            setMensajeError('Ocurrió un error inesperado. Por favor, intentá de nuevo.');
            setEstadoBusqueda('error');
        }
    };

    const handleResetearBusqueda = () => {
        setInputBusqueda('');
        setPedidosEncontrados([]);
        setEstadoBusqueda('inicial');
        setMensajeError('');
        setTipoBusqueda('codigo');
    };

    const placeholderText = {
        codigo: "Ingresá tu código de pedido...",
        nombre: "Ingresá el nombre o empresa...",
        email: "Ingresá tu e-mail...",
    };

    const iconInput = {
        codigo: <Search />,
        nombre: <User />,
        email: <Mail />,
    };

    return (
        <>
            <Helmet>
                <title>Seguimiento de Pedidos | Fénix Indumentaria</title>
                <meta name="description" content="Consultá el estado de tu pedido en tiempo real." />
            </Helmet>
            <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center antialiased">
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center w-full">
                        <img src="https://st5.depositphotos.com/1020070/65598/v/600/depositphotos_655984974-stock-illustration-phoenix-bird-icon-firebird-fire.jpg" alt="Logo Fénix" className="h-16 mx-auto mb-4"/>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">Seguimiento de Pedidos</h1>
                        <p className="text-lg text-gray-600 mt-2">Ingresá tu código o tus datos para ver el estado de tu orden en tiempo real.</p>
                    </motion.div>

                    {/* Muestra el formulario de búsqueda si no hay pedidos o si el estado no es 'encontrado' */}
                    {estadoBusqueda !== 'encontrado' && (
                        <div className="w-full max-w-2xl mt-8">
                            <form onSubmit={handleBuscarPedido} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-grow">
                                        <label htmlFor="tipoBusqueda" className="sr-only">Buscar por</label>
                                        <select
                                            id="tipoBusqueda"
                                            value={tipoBusqueda}
                                            onChange={(e) => {
                                                setTipoBusqueda(e.target.value);
                                                setInputBusqueda(''); // Limpiar el input al cambiar tipo de búsqueda
                                            }}
                                            className="w-full px-4 py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                            disabled={estadoBusqueda === 'buscando'}
                                        >
                                            <option value="codigo">Código de Pedido</option>
                                            <option value="nombre">Nombre / Empresa</option>
                                            <option value="email">E-mail</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-grow">
                                        <input
                                            type={tipoBusqueda === 'email' ? 'email' : 'text'}
                                            value={inputBusqueda}
                                            onChange={(e) => setInputBusqueda(e.target.value)}
                                            placeholder={placeholderText[tipoBusqueda]}
                                            className="w-full pl-5 pr-12 py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-mono"
                                            disabled={estadoBusqueda === 'buscando'}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            {iconInput[tipoBusqueda]}
                                        </div>
                                    </div>
                                    <button type="submit" disabled={estadoBusqueda === 'buscando' || !inputBusqueda}
                                        className="flex items-center justify-center bg-red-600 text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-red-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                                        {estadoBusqueda === 'buscando' ? <Loader size={24} className="animate-spin" /> : "Consultar"}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {(estadoBusqueda === 'noEncontrado' || estadoBusqueda === 'error') && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="mt-4 flex items-center p-3 bg-red-50 text-red-800 rounded-lg border border-red-200">
                                            <AlertCircle className="mr-3 flex-shrink-0" />
                                            <p><strong>{estadoBusqueda === 'noEncontrado' ? 'Pedido no encontrado.' : 'Error.'}</strong> {mensajeError || 'Por favor, verificá los datos e intentá de nuevo.'}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Leyenda "No encontrás tu pedido?" */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center mt-6 text-gray-600 text-sm"
                                >
                                    <p>¿No encontrás tu pedido? <a href="/contacto" className="text-red-600 hover:underline font-semibold">Contactanos aquí</a> o llamanos al +549 236 461-1100</p>
                                </motion.div>

                            </form>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {estadoBusqueda === 'encontrado' && pedidosEncontrados.length > 0 && (
                            <motion.div
                                key="resultados-multiples"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full max-w-5xl mt-8 space-y-8" // Margen entre las tarjetas de pedido
                            >
                                {pedidosEncontrados.length > 1 && (
                                    <p className="text-lg text-gray-700 text-center font-semibold mb-4">Se encontraron {pedidosEncontrados.length} pedidos:</p>
                                )}
                                {pedidosEncontrados.map(pedido => (
                                    <ResultadoPedido key={pedido.pedidoId} pedido={pedido} />
                                ))}
                                <div className="text-center mt-12">
                                    <button
                                        onClick={handleResetearBusqueda}
                                        className="flex items-center justify-center mx-auto text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        <RefreshCw size={16} className="mr-2" /> Consultar otro pedido
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default Seguimiento;