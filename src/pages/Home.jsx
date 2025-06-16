import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

// --- CONEXIÓN A FIREBASE ---
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// --- ÍCONOS ---
import {
  ClipboardList, BookOpen, Truck, Palette, ShieldCheck, Users,
  Sparkles, Phone, Mail, MapPin, Instagram, Facebook, Award, MessageCircle
} from 'lucide-react';

// --- COMPONENTES HIJOS ---
import { default as ActionCard } from '../components/ActionCard';
import { default as ProductCard } from '../components/ProductCard';


// --- COMPONENTE PRINCIPAL: HOME (SUPER OPTIMIZADO) ---
const Home = () => {

  // --- ESTADO PARA PRODUCTOS DESTACADOS ---
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // --- EFECTO PARA CARGAR PRODUCTOS DESTACADOS DESDE FIREBASE ---
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // La consulta busca productos que tengan el campo 'destacado' en true
        const q = query(collection(db, "productos"), where("destacado", "==", true), limit(4));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedProducts(productsData);
      } catch (error) {
        console.error("Error al cargar productos destacados: ", error);
        // En caso de error, no rompemos la página, simplemente no mostramos nada.
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const whyChooseUs = [
    { icon: <ShieldCheck className="w-12 h-12 text-red-600" />, title: 'Calidad y Resistencia', description: 'Materiales de primera línea y confección reforzada para garantizar la máxima durabilidad.' },
    { icon: <Users className="w-12 h-12 text-red-600" />, title: 'Asesoramiento Personalizado', description: 'Atención directa por especialistas que entienden las necesidades de cada rubro y empresa.' },
    { icon: <Sparkles className="w-12 h-12 text-red-600" />, title: 'Tecnología en Personalización', description: 'Equipos de última generación para estampados y bordados que aseguran una imagen impecable.' }
  ];
  
  const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <SEO
        title="Inicio"
        description="Líderes en venta de ropa de trabajo, calzado de seguridad y servicios de estampado y bordado para empresas en toda Argentina. Calidad y asesoramiento profesional."
        ogUrl="/"
      />
      
      {/* === HERO SECTION === */}
      <section className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-white text-center px-4">
        <div className="absolute inset-0 bg-gray-900 opacity-60 z-10"></div>
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" src="https://videos.pexels.com/video-files/7578845/7578845-hd_1920_1080_25fps.mp4" />
        <motion.div 
          className="relative z-20 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img 
            src="https://st5.depositphotos.com/1020070/65598/v/600/depositphotos_655984974-stock-illustration-phoenix-bird-icon-firebird-fire.jpg" 
            alt="Logo de Fénix" 
            className="w-24 h-24 mb-4 rounded-full"
            style={{ filter: 'brightness(0) invert(1)' }}
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/ffffff/b91c1c?text=F'; }}
          />
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg">Fénix</h1>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mt-2 drop-shadow-lg">Ropa de trabajo y Calzado de seguridad</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 drop-shadow-md">Calidad, seguridad y diseño para los profesionales y empresas de hoy.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/pedido" className="mt-8 inline-block bg-red-600 text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-red-700 transition-all duration-300 shadow-lg">
              Solicitar Presupuesto
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* === NUEVA SECCIÓN: BARRA DE CONFIANZA === */}
      <motion.section {...sectionAnimation} className="bg-white">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <Truck className="w-10 h-10 text-red-600 mb-2" />
                    <p className="font-semibold">Envíos a todo el País</p>
                </div>
                <div className="flex flex-col items-center">
                    <Award className="w-10 h-10 text-red-600 mb-2" />
                    <p className="font-semibold">Calidad Garantizada</p>
                </div>
                <div className="flex flex-col items-center">
                    <ShieldCheck className="w-10 h-10 text-red-600 mb-2" />
                    <p className="font-semibold">Compra Segura</p>
                </div>
                <div className="flex flex-col items-center">
                    <MessageCircle className="w-10 h-10 text-red-600 mb-2" />
                    <p className="font-semibold">Asesoramiento Profesional</p>
                </div>
            </div>
        </div>
      </motion.section>

      {/* === TARJETAS DE ACCIÓN === */}
      <motion.section {...sectionAnimation} className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <ActionCard icon={<ClipboardList />} title="Hacer un Pedido" description="Iniciá tu cotización para compras mayoristas y minoristas." to="/pedido" />
                  <ActionCard icon={<BookOpen />} title="Ver Catálogo" description="Explorá nuestra línea completa de productos y marcas líderes." to="/catalogo" />
                  <ActionCard icon={<Truck />} title="Seguimiento de Envío" description="Consultá el estado de tu orden con tu código de seguimiento." to="/seguimiento" />
                  <ActionCard icon={<Palette />} title="Estampados y Bordados" description="Personalizá la ropa de tu equipo con la imagen de tu marca." to="/pedido" />
              </div>
          </div>
      </motion.section>

      {/* === PRODUCTOS DESTACADOS (AHORA DINÁMICOS) === */}
      {!loadingProducts && featuredProducts.length > 0 && (
        <motion.section {...sectionAnimation} className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Nuestros Productos Destacados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </motion.section>
      )}

      {/* === POR QUÉ ELEGIRNOS === */}
      <motion.section {...sectionAnimation} className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Por Qué Elegir Fénix?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  {whyChooseUs.map((feature, index) => (
                      <div key={index} className="flex flex-col items-center text-center p-6">
                          {feature.icon}
                          <h3 className="text-xl font-bold my-4">{feature.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </motion.section>

      {/* === LLAMADO A LA ACCIÓN FINAL === */}
      <motion.section {...sectionAnimation} className="bg-gray-800 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ¿Listo para vestir a tu equipo con lo mejor?
              </h2>
              <p className="max-w-2xl mx-auto mb-8 text-gray-300">
                  Hablemos de tus necesidades. Nuestro equipo te brindará una solución a medida.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/contacto" className="bg-red-600 text-white font-bold py-4 px-12 rounded-lg text-lg hover:bg-red-700 transition-colors duration-300 shadow-xl">
                      Contactar a un Asesor
                  </Link>
              </motion.div>
          </div>
      </motion.section>
      
      {/* === FOOTER FORTIFICADO === */}
      <footer className="bg-gray-900 text-gray-300 py-12" id="contacto">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="md:col-span-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">FÉNIX</h3>
              <p className="text-sm">Profesionales en indumentaria y seguridad laboral. Confianza y calidad para tu empresa.</p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-4">Contacto Directo</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-center md:justify-start hover:text-red-500 transition-colors"><Phone className="w-5 h-5 mr-3" /><span>+54 9 236 4611100</span></li>
                <li className="flex items-center justify-center md:justify-start hover:text-red-500 transition-colors"><Mail className="w-5 h-5 mr-3" /><span>ventas.fenixropadetrabajo@gmail.com</span></li>
                <li className="flex items-center justify-center md:justify-start hover:text-red-500 transition-colors"><MapPin className="w-5 h-5 mr-3" /><span>Av. Rivadavia, Junín, Buenos Aires</span></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-4">Información Legal</h3>
              <ul className="space-y-3 text-sm">
                  <li><Link to="/terminos" className="hover:text-red-500 transition-colors">Términos y Condiciones</Link></li>
                  <li><Link to="/privacidad" className="hover:text-red-500 transition-colors">Política de Privacidad</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-4">Seguinos</h3>
              <div className="flex justify-center md:justify-start space-x-5">
                <a href="https://instagram.com/fenixjunin" target="_blank" rel="noopener noreferrer" aria-label="Visita nuestro Instagram" className="text-gray-300 hover:text-red-500 hover:scale-110 transition-all duration-300"><Instagram className="w-8 h-8" /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visita nuestro Facebook" className="text-gray-300 hover:text-red-500 hover:scale-110 transition-all duration-300"><Facebook className="w-8 h-8" /></a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Plataforma desarrollada por Federico Zilberman. Usada por Fénix Ropa de Trabajo. Todos los derechos reservados.</p>
            <div className="mt-4 flex justify-center items-center gap-4">
                <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario" target="_blank" rel="noopener noreferrer" className="hover:underline">Defensa del Consumidor</a>
                <span>|</span>
                <Link to="/libro-de-quejas" className="hover:underline">Libro de Quejas Online</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
// Compare this snippet from src/pages/admin/Login.jsx:
// import React, { useState } from 'react';