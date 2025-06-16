import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { ArrowLeft, Shirt, Ruler, CheckCircle, AlertTriangle } from 'lucide-react';
import { FaShoePrints } from 'react-icons/fa';

// --- DATOS CENTRALIZADOS DENTRO DEL COMPONENTE ---
const DATOS_GUIAS = {
  tops: {
    titulo: "Partes de Arriba (Remeras y Buzos)",
    tabla: [
      { talle: 'S', anchoPecho: '50 cm', largoPrenda: '68 cm' },
      { talle: 'M', anchoPecho: '52 cm', largoPrenda: '70 cm' },
      { talle: 'L', anchoPecho: '54 cm', largoPrenda: '72 cm' },
      { talle: 'XL', anchoPecho: '56 cm', largoPrenda: '74 cm' },
      { talle: 'XXL', anchoPecho: '58 cm', largoPrenda: '76 cm' },
      { talle: '3XL', anchoPecho: '60 cm', largoPrenda: '78 cm' },
      { talle: '4XL', anchoPecho: '62 cm', largoPrenda: '80 cm' },
      { talle: '5XL', anchoPecho: '64 cm', largoPrenda: '82 cm' },
      { talle: '6XL', anchoPecho: '66 cm', largoPrenda: '84 cm' },
      { talle: '7XL', anchoPecho: '68 cm', largoPrenda: '86 cm' },
    ],
    instrucciones: [
      { titulo: "1. Buscá tu prenda de referencia", descripcion: "Elegí una remera o buzo que te quede bien. Extiéndelo sobre una superficie plana.", icono: <Shirt size={24} className="text-red-600" /> },
      { titulo: "2. Medí el Ancho (A)", descripcion: "Con una cinta métrica, medí el ancho de la prenda de axila a axila. No estires la tela.", icono: <Ruler size={24} className="text-red-600" /> },
      { titulo: "3. Medí el Largo (B)", descripcion: "Medí el largo desde el punto más alto del cuello hasta el borde inferior.", icono: <Ruler size={24} className="text-red-600" /> },
      { titulo: "4. Compará y elegí", descripcion: "Con tus dos medidas, buscá en nuestra tabla el talle que mejor se ajuste. ¡Listo!", icono: <CheckCircle size={24} className="text-green-600" /> }
    ],
  },
  pantalones: {
    titulo: "Pantalones de Trabajo",
    tabla: [
      { talle: '38', cintura: '38 cm', largo: '102 cm' },
      { talle: '40', cintura: '40 cm', largo: '104 cm' },
      { talle: '42', cintura: '42 cm', largo: '106 cm' },
      { talle: '44', cintura: '44 cm', largo: '108 cm' },
      { talle: '46', cintura: '46 cm', largo: '110 cm' },
      { talle: '48', cintura: '48 cm', largo: '112 cm' },
      { talle: '50', cintura: '50 cm', largo: '114 cm' },
    ],
    instrucciones: [
      { titulo: "1. Buscá tu pantalón de referencia", descripcion: "Elegí un pantalón (no de jean) que te quede cómodo. Abrochalo y extendelo sobre una superficie plana.", icono: <Ruler size={24} className="text-red-600" /> },
      { titulo: "2. Medí la Cintura (A)", descripcion: "Medí el ancho de la cintura de un extremo al otro. No midas el contorno completo.", icono: <Ruler size={24} className="text-red-600" /> },
      { titulo: "3. Medí el Largo (B)", descripcion: "Medí el largo total por el costado exterior, desde la cintura hasta el tobillo.", icono: <Ruler size={24} className="text-red-600" /> },
      { titulo: "4. Compará y elegí", descripcion: "Buscá en la tabla la medida de cintura más cercana a la tuya. ¡Ese es tu talle!", icono: <CheckCircle size={24} className="text-green-600" /> }
    ],
  },
  calzado: {
    titulo: "Calzado de Seguridad",
    tabla: [
      { talle: '38', cm: '25 cm' },
      { talle: '39', cm: '25.5 cm' },
      { talle: '40', cm: '26 cm' },
      { talle: '41', cm: '26.5 cm' },
      { talle: '42', cm: '27 cm' },
      { talle: '43', cm: '28 cm' },
      { talle: '44', cm: '28.5 cm' },
      { talle: '45', cm: '29.5 cm' },
    ],
    instrucciones: [
      { titulo: "1. Prepará una hoja y un lápiz", descripcion: "Colocá una hoja de papel en el suelo, pegada a una pared.", icono: <FaShoePrints size={24} className="text-red-600" /> },
      { titulo: "2. Marcá tu pie", descripcion: "Parate sobre la hoja con el talón pegado a la pared. Hacé una marca justo donde termina tu dedo más largo.", icono: <Ruler size={24} className="text-red-600" /> },
      { titulo: "3. Medí la distancia", descripcion: "Con una regla o cinta métrica, medí la distancia en centímetros desde el borde de la hoja hasta la marca.", icono: <Ruler size={24} className="text-red-600" /> },
      { titulo: "4. Compará y elegí", descripcion: "Buscá tu medida en la tabla para encontrar tu talle correcto. Si estás entre dos, elegí el más grande.", icono: <CheckCircle size={24} className="text-green-600" /> }
    ],
  }
};

// --- SUB-COMPONENTES DE DIAGRAMAS ---
const DiagramaTops = () => (
    <div className="flex justify-center items-center p-4 my-8"><svg width="200" height="240" viewBox="0 0 100 120" className="max-w-xs"><path d="M20,10 L80,10 L95,25 L85,115 L15,115 L5,25 Z" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/><path d="M40,10 C40,20 60,20 60,10 Z" fill="none" stroke="#9ca3af" strokeWidth="1"/><path d="M20,10 L5,25 L10,35 L25,15 Z" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/><path d="M80,10 L95,25 L90,35 L75,15 Z" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/><path d="M15,30 L85,30" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2"/><path d="M15,28 L15,32" stroke="#b91c1c" strokeWidth="1"/><path d="M85,28 L85,32" stroke="#b91c1c" strokeWidth="1"/><text x="45" y="25" fill="#b91c1c" fontSize="8" textAnchor="end" fontWeight="bold">A</text><path d="M50,15 L50,110" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2"/><path d="M48,15 L52,15" stroke="#b91c1c" strokeWidth="1"/><path d="M48,110 L52,110" stroke="#b91c1c" strokeWidth="1"/><text x="55" y="65" fill="#b91c1c" fontSize="8" fontWeight="bold">B</text></svg></div>
);
const DiagramaPantalones = () => (
    <div className="flex justify-center items-center p-4 my-8"><svg width="120" height="240" viewBox="0 0 60 120" className="max-w-xs"><path d="M10 5 L50 5 L55 20 L50 115 L10 115 L5 20 Z" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/><path d="M30 20 L30 115" stroke="#9ca3af" strokeWidth="0.5"/><path d="M10 5 L20 5" stroke="#9ca3af" strokeWidth="1"/><path d="M40 5 L50 5" stroke="#9ca3af" strokeWidth="1"/><path d="M10 5 C 15 10, 20 10, 25 5" fill="none" stroke="#9ca3af" strokeWidth="1"/><path d="M35 5 C 40 10, 45 10, 50 5" fill="none" stroke="#9ca3af" strokeWidth="1"/><path d="M10 5 L50 5" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2"/><path d="M8 5 L12 5" stroke="#b91c1c" strokeWidth="1"/><path d="M48 5 L52 5" stroke="#b91c1c" strokeWidth="1"/><text x="28" y="12" fill="#b91c1c" fontSize="8" fontWeight="bold">A</text><path d="M52 10 L52 110" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2"/><path d="M50 10 L54 10" stroke="#b91c1c" strokeWidth="1"/><path d="M50 110 L54 110" stroke="#b91c1c" strokeWidth="1"/><text x="55" y="60" fill="#b91c1c" fontSize="8" fontWeight="bold">B</text></svg></div>
);
const DiagramaCalzado = () => (
    <div className="flex justify-center items-center p-4 my-8"><svg width="150" height="240" viewBox="0 0 75 120" className="max-w-xs"><path d="M20 110 C 10 110, 5 100, 10 90 L 25 40 C 30 20, 50 10, 65 15 C 80 20, 75 40, 70 50 L 55 90 C 50 105, 40 115, 20 110 Z" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/><path d="M12,95 L68,20" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2"/><path d="M10,97 L14,93" stroke="#b91c1c" strokeWidth="1"/><path d="M66,22 L70,18" stroke="#b91c1c" strokeWidth="1"/><text x="40" y="60" fill="#b91c1c" fontSize="8" fontWeight="bold">A</text></svg></div>
);

// --- SUB-COMPONENTE: Navegación por Pestañas ---
const NavegacionCategorias = ({ categoriaActiva, setCategoriaActiva }) => (
    <div className="flex justify-center border-b border-gray-200 mb-8">
        {Object.keys(DATOS_GUIAS).map((key) => (
            <button key={key} onClick={() => setCategoriaActiva(key)} className={`px-4 py-3 text-sm sm:text-base font-semibold transition-colors duration-300 ${categoriaActiva === key ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-red-600'}`}>
                {DATOS_GUIAS[key].titulo.split('(')[0].trim()}
            </button>
        ))}
    </div>
);

// --- SUB-COMPONENTE: Sección de Guía Genérica ---
const GuiaSeccion = ({ data, diagrama }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <section className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">¿Cómo tomar tus medidas?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {diagrama}
                <div className="space-y-4">
                    {data.instrucciones.map((instruccion, index) => (
                        <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 pt-1">{instruccion.icono}</div>
                            <div className="ml-4">
                                <h3 className="font-semibold text-gray-800">{instruccion.titulo}</h3>
                                <p className="text-sm text-gray-600">{instruccion.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">Tabla de Equivalencias</h2>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-center">
                    <thead className="bg-red-600">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Talle</th>
                            {Object.keys(data.tabla[0]).filter(k => k !== 'talle').map(header => <th key={header} scope="col" className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">{header.replace(/([A-Z])/g, ' $1').trim()}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.tabla.map((fila) => (
                            <tr key={fila.talle} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{fila.talle}</td>
                                {Object.keys(fila).filter(k => k !== 'talle').map(key => <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{fila[key]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">*Medidas de referencia. Tolerancia +/- 1.5cm.</p>
        </section>
    </motion.div>
);

// --- NUEVO SUB-COMPONENTE: Aclaraciones Importantes ---
const SeccionAclaraciones = () => (
    <section className="mt-10 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
        <div className="flex">
            <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-bold text-yellow-800">Aclaraciones Importantes</h3>
                <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc space-y-2 pl-5">
                        <li>Esta guía es una herramienta de referencia. Las medidas son aproximadas y pueden tener una tolerancia.</li>
                        <li>Las medidas se toman sobre la prenda en plano, no sobre el cuerpo.</li>
                        <li>Pueden existir ligeras variaciones entre diferentes modelos o tipos de tela.</li>
                        <li>El método más fiable es siempre comparar estas medidas con una prenda similar que ya te quede bien.</li>
                        <li>Ante la duda entre dos talles, te recomendamos elegir el más grande para mayor comodidad.</li>
                        <li>¡Para un asesoramiento personalizado, no dudes en <a href="/contacto" className="font-bold underline hover:text-yellow-800">contactarnos</a>!</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);


// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
const GuiaTalles = () => {
    const [categoriaActiva, setCategoriaActiva] = useState('tops');

    const guias = {
      tops: <GuiaSeccion data={DATOS_GUIAS.tops} diagrama={<DiagramaTops />} />,
      pantalones: <GuiaSeccion data={DATOS_GUIAS.pantalones} diagrama={<DiagramaPantalones />} />,
      calzado: <GuiaSeccion data={DATOS_GUIAS.calzado} diagrama={<DiagramaCalzado />} />,
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-sans antialiased">
            <SEO
                title="Guía de Talles"
                description="Encontrá tu talle perfecto para remeras, pantalones y calzado Fénix. Te ayudamos a medir correctamente."
                ogUrl="/guia-de-talles"
            />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10">
                <div className="text-center mb-8">
                    <img src="https://st5.depositphotos.com/1020070/65598/v/600/depositphotos_655984974-stock-illustration-phoenix-bird-icon-firebird-fire.jpg" alt="Logo Fénix" className="h-20 sm:h-24 mx-auto mb-4" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/b91c1c/white?text=F'; }}/>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">Guía de Talles Fénix</h1>
                    <p className="text-md sm:text-lg text-gray-600 mt-2">Elegí una categoría para encontrar tu medida ideal.</p>
                </div>
                
                <NavegacionCategorias categoriaActiva={categoriaActiva} setCategoriaActiva={setCategoriaActiva} />

                <AnimatePresence mode="wait">
                  {guias[categoriaActiva]}
                </AnimatePresence>

                <SeccionAclaraciones />
                
                <div className="mt-10 text-center">
                    <a href="/pedido" className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all transform hover:scale-105">
                        <ArrowLeft size={20} className="mr-2" /> Volver al Formulario de Pedido
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default GuiaTalles;
// Este componente GuiaTalles proporciona una guía visual y textual para ayudar a los usuarios a elegir el talle correcto de productos Fénix.
// Utiliza Framer Motion para animaciones suaves y una estructura clara para una mejor experiencia de usuario.