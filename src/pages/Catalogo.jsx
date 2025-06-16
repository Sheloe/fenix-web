import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { CheckCircle, XCircle, Tag, Loader, AlertTriangle, Search, Info } from 'lucide-react';

// --- CONEXIÓN A FIREBASE ---
import { collection, getDocs, query } from 'firebase/firestore'; // Ya no se importa orderBy
import { db } from '../firebaseConfig';


// --- SUB-COMPONENTE: Tarjeta de Producto Individual (sin cambios) ---
const ProductCard = ({ producto }) => {
    const slug = producto.slug || producto.nombre.toLowerCase().replace(/\s+/g, '-');
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="card-fenix flex flex-col"
        >
            <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                    src={producto.img} 
                    alt={producto.nombre} 
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x600/cccccc/ffffff?text=Imagen+no+disponible'; }}
                />
                <span className="badge-fenix absolute top-2 right-2">{producto.categoria}</span>
            </div>
            <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-800">{producto.nombre}</h2>
                <p className="text-sm text-gray-600 mt-1 mb-4 flex-grow">{producto.descripcion}</p>
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                        <Tag size={16} className="mr-2 text-red-600" />
                        <strong>Talles:</strong><span className="ml-2">{producto.talles.join(', ')}</span>
                    </div>
                    <div className="flex items-center">
                        {producto.estampa ? <CheckCircle size={16} className="mr-2 text-green-600" /> : <XCircle size={16} className="mr-2 text-gray-400" />}
                        <span className={producto.estampa ? "text-gray-700" : "text-gray-500"}>{producto.estampa ? 'Apto para personalizar' : 'No personalizable'}</span>
                    </div>
                </div>
                <Link to={`/producto/${slug}`} className="btn btn-primario w-full mt-6">
                    Ver Detalles
                </Link>
            </div>
        </motion.div>
    );
};

// --- NUEVO SUB-COMPONENTE: Sección de Disclaimers ---
const DisclaimerSection = () => (
    <div className="mt-16 p-6 bg-gray-50 border-l-4 border-red-500 rounded-r-lg">
        <div className="flex">
            <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-bold text-gray-800">Aclaraciones Importantes</h3>
                <div className="mt-2 text-sm text-gray-700">
                    <ul className="list-disc space-y-2 pl-5">
                        <li>La disponibilidad de los productos y talles que se muestran está sujeta a confirmación al momento de realizar el presupuesto.</li>
                        <li>Los colores de las prendas pueden variar ligeramente respecto a lo que se ve en pantalla debido a las diferencias de calibración de cada monitor.</li>
                        <li>Las imágenes utilizadas son de carácter ilustrativo y pueden no representar con exactitud total el producto final.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL: Catalogo (Con la consulta corregida) ---
const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const q = query(collection(db, "productos"));
                const querySnapshot = await getDocs(q);
                const productosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                productosData.sort((a, b) => a.nombre.localeCompare(b.nombre));
                setProductos(productosData);
            } catch (err) {
                console.error("Error al cargar productos: ", err);
                setError("No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const categorias = useMemo(() => ['Todos', ...new Set(productos.map(p => p.categoria))], [productos]);
    const productosFiltrados = useMemo(() => {
        return productos
            .filter(producto => filtroCategoria === 'Todos' || producto.categoria === filtroCategoria)
            .filter(producto => producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()));
    }, [productos, filtroCategoria, terminoBusqueda]);

    const renderContent = () => {
        if (loading) return <div className="col-span-full flex justify-center p-16"><Loader className="animate-spin text-red-600" size={48} /></div>;
        if (error) return <div className="col-span-full flex flex-col items-center p-16 bg-red-50 rounded-lg"><AlertTriangle className="text-red-500 mb-4" size={48} /><h3 className="text-xl font-bold text-red-800">Ocurrió un Error</h3><p className="text-red-700">{error}</p></div>;
        if (productosFiltrados.length === 0) return <p className="col-span-full text-center text-gray-500 py-16">No se encontraron productos que coincidan con tu búsqueda.</p>;
        
        return (
            <AnimatePresence>
                {productosFiltrados.map(producto => <ProductCard key={producto.id} producto={producto} />)}
            </AnimatePresence>
        );
    };

    return (
        <div className="contenedor-fenix py-12">
            <SEO
                title="Catálogo de Productos"
                description="Explorá nuestra completa línea de ropa de trabajo, calzado de seguridad y equipos de protección personal (EPP) en Fénix, Junín."
                ogUrl="/catalogo"
            />
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="titulo-principal text-center">Nuestro Catálogo</h1>
                <p className="text-lg text-gray-600 text-center mt-2 mb-8">Productos diseñados para la máxima durabilidad y seguridad.</p>

                <div className="mb-12 space-y-6">
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre de producto..."
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-center flex-wrap gap-3">
                        {categorias.map(categoria => (
                            <button key={categoria} onClick={() => setFiltroCategoria(categoria)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${filtroCategoria === categoria ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200 border'}`}>
                                {categoria}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {renderContent()}
            </div>
            
            {/* --- SECCIÓN DE DISCLAIMER AGREGADA --- */}
            <DisclaimerSection />
        </div>
    );
};

export default Catalogo;
// Este componente Catalogo ahora incluye:
// - Un campo de búsqueda para filtrar productos por nombre. 