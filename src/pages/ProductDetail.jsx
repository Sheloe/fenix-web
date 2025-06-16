import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import SEO from '../components/SEO';
import { Loader, AlertTriangle, CheckCircle, XCircle, Tag } from 'lucide-react';

const ProductDetail = () => {
    const { slug } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

    useEffect(() => {
        const fetchProducto = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const q = query(collection(db, "productos"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    setProducto({ id: querySnapshot.docs[0].id, ...docData });
                } else {
                    setError("El producto que buscás no existe o no está disponible.");
                }
            } catch (err) {
                console.error("Error al cargar producto:", err);
                setError("Ocurrió un error al cargar la información del producto.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [slug]);

    // --- RENDERIZADO CONDICIONAL ---
    // Muestra estados de carga o error antes de intentar renderizar el producto.
    if (loading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-red-600" size={48} /></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-screen p-4 text-center"><AlertTriangle className="text-red-500 mb-4" size={48} /><h3 className="text-xl font-bold text-red-800">Ocurrió un Error</h3><p className="text-red-700">{error}</p></div>;
    if (!producto) return null; // Si no hay producto, no renderiza nada.

    // --- LÓGICA DEFENSIVA ---
    // Se asegura de que la aplicación no se rompa si faltan datos en Firestore.
    const galeria = (producto.galeria_imagenes && producto.galeria_imagenes.length > 0)
        ? producto.galeria_imagenes
        : [producto.img]; // Si no hay galería, crea una lista con la imagen principal.
        
    const descripcion = producto.descripcion_detallada || producto.descripcion;

    return (
        <>
            <SEO
                title={producto.nombre}
                description={descripcion}
                ogImage={galeria[0]} // Ahora 'galeria' siempre será un array válido.
                ogUrl={`/producto/${producto.slug}`}
            />
            <div className="contenedor-fenix py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Galería de Imágenes */}
                    <div>
                        <div className="mb-4 rounded-lg overflow-hidden border bg-gray-100">
                            <img src={galeria[imagenSeleccionada]} alt={`${producto.nombre} - imagen ${imagenSeleccionada + 1}`} className="w-full h-auto object-cover aspect-square" />
                        </div>
                        {/* Solo muestra los thumbnails si hay más de una imagen */}
                        {galeria.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {galeria.map((img, index) => (
                                    <button key={index} onClick={() => setImagenSeleccionada(index)} className={`rounded-lg overflow-hidden border-2 transition-all ${imagenSeleccionada === index ? 'border-red-600' : 'border-transparent hover:border-gray-300'}`}>
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-auto object-cover aspect-square" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detalles del Producto */}
                    <div>
                        <span className="badge-fenix mb-2">{producto.categoria}</span>
                        <h1 className="titulo-principal mb-4">{producto.nombre}</h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">{descripcion}</p>
                        
                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <div className="flex items-center text-gray-700">
                                <Tag size={20} className="mr-3 text-red-600" />
                                <div>
                                    <h3 className="font-bold">Talles Disponibles</h3>
                                    <p>{producto.talles ? producto.talles.join(' - ') : 'No especificado'}</p>
                                </div>
                            </div>
                             <div className="flex items-center">
                                {producto.estampa ? <CheckCircle size={20} className="mr-3 text-green-600" /> : <XCircle size={20} className="mr-3 text-gray-400" />}
                                <div>
                                    <h3 className="font-bold">Personalización</h3>
                                    <p>{producto.estampa ? 'Apto para estampar o bordar' : 'No personalizable'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                             <Link to="/pedido" state={{ producto: producto.nombre }} className="btn btn-primario w-full text-center">
                                Solicitar Presupuesto de este Producto
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
//     <p className="mt-2">1. Los colores pueden variar según la pantalla y el lote de producción.</p>
//     <p className="mt-2">2. Las imágenes son ilustrativas y pueden no representar el producto final.</p>  