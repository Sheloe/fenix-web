import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Edit, Trash2, XCircle, FileText } from 'lucide-react';

// --- DATOS (Mantenidos aquí o importados desde un archivo de configuración central) ---
const PRENDAS_DISPONIBLES = [
  // ... tu lista de prendas
  { id: 'remera-mc', nombre: 'Remera Manga Corta', imagen: '/images/mockups/remera-base.png', talles: ['S', 'M', 'L', 'XL', 'XXL'], colores: [{ nombre: 'Blanco', hex: '#FFFFFF' }, { nombre: 'Negro', hex: '#212121' }] },
  { id: 'chomba-pique', nombre: 'Chomba Piqué', imagen: '/images/mockups/chomba-base.png', talles: ['S', 'M', 'L', 'XL'], colores: [{ nombre: 'Azul Francia', hex: '#1976D2' }] },
];
const COLOR_IMAGE_MAP = {
    'Remera Manga Corta-Negro': '/images/mockups/remera-negra.png',
};

// --- SUB-COMPONENTE 1: El Formulario para agregar/editar una combinación ---
const FormularioCombinacion = ({ combinacion, setCombinacion, errores, prendaSeleccionada, handleAgregarOActualizar, resetFormCombinacion, editingId }) => (
    <div className="lg:col-span-3 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
        <h3 className="font-bold text-lg text-gray-800">{editingId ? "Editando Combinación" : "Agregar Combinación"}</h3>
        <select value={combinacion.idPrenda} onChange={(e) => setCombinacion({ ...combinacion, idPrenda: e.target.value, nombrePrenda: e.target.options[e.target.selectedIndex].text, talle:'', color:'' })} className="w-full p-2 border rounded-lg">
            <option value="">-- Seleccionar Prenda --</option>
            {PRENDAS_DISPONIBLES.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        {errores.idPrenda && <p className="text-xs text-red-600 -mt-2">{errores.idPrenda}</p>}
        
        {prendaSeleccionada && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-sm font-medium">Talle</label>
                    <select value={combinacion.talle} onChange={(e) => setCombinacion({ ...combinacion, talle: e.target.value })} className="w-full p-2 border rounded-lg mt-1">
                        <option value="">--</option>
                        {prendaSeleccionada.talles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errores.talle && <p className="text-xs text-red-600">{errores.talle}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium">Color</label>
                    <select value={combinacion.color} onChange={(e) => setCombinacion({ ...combinacion, color: e.target.value })} className="w-full p-2 border rounded-lg mt-1">
                        <option value="">--</option>
                        {prendaSeleccionada.colores.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
                    </select>
                    {errores.color && <p className="text-xs text-red-600">{errores.color}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium">Cantidad</label>
                    <input type="number" min="1" value={combinacion.cantidad} onChange={(e) => setCombinacion({ ...combinacion, cantidad: parseInt(e.target.value) || 1 })} className="w-full p-2 border rounded-lg mt-1" />
                    {errores.cantidad && <p className="text-xs text-red-600">{errores.cantidad}</p>}
                </div>
            </motion.div>
        )}
        <div className="flex gap-2">
            <button onClick={handleAgregarOActualizar} className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400" disabled={!prendaSeleccionada}>
                {editingId ? <><Check size={18}/> Actualizar</> : <><Plus size={18}/> Agregar</>}
            </button>
            {editingId && <button onClick={resetFormCombinacion} className="mt-4 w-auto flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"><XCircle size={18}/></button>}
        </div>
    </div>
);

// --- SUB-COMPONENTE 2: La Vista Previa de la Prenda ---
const VistaPreviaPrenda = ({ prendaSeleccionada, combinacion }) => {
    const dynamicImageUrl = useMemo(() => {
        if (!prendaSeleccionada) return '/images/mockups/placeholder.png';
        const key = `${prendaSeleccionada.nombre}-${combinacion.color}`;
        return COLOR_IMAGE_MAP[key] || prendaSeleccionada.imagen;
    }, [prendaSeleccionada, combinacion.color]);
    
    return (
        <div className="lg:col-span-2 p-6 rounded-lg flex flex-col items-center justify-center space-y-2">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center transition-colors" style={{ backgroundColor: prendaSeleccionada?.colores.find(c => c.nombre === combinacion.color)?.hex || '#F3F4F6' }}>
                <AnimatePresence>
                   <motion.img key={dynamicImageUrl} src={dynamicImageUrl} alt={prendaSeleccionada?.nombre || 'Prenda'} className="relative z-10 h-full object-contain" initial={{opacity: 0, scale: 0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0}}/>
                </AnimatePresence>
                {!prendaSeleccionada && <FileText className="text-gray-400" size={48} />}
            </div>
            <h4 className="font-bold text-lg text-gray-800">{prendaSeleccionada?.nombre || "Seleccione una prenda"}</h4>
            <p className="text-sm text-gray-500">{combinacion.color || "Seleccione un color"}</p>
        </div>
    );
};

// --- SUB-COMPONENTE 3: La Lista de Prendas Agregadas ---
const ListaPrendasAgregadas = ({ prendas, handleEditar, handleEliminar, error }) => (
    <div className="mt-8">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Prendas Seleccionadas</h3>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            <AnimatePresence>
                {prendas.length > 0 ? prendas.map(p => (
                    <motion.div key={p.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, transition:{duration:0.2} }} className="flex justify-between items-center p-3 bg-white rounded-lg border shadow-sm">
                        <div>
                            <p className="font-semibold">{p.nombrePrenda}</p>
                            <p className="text-sm text-gray-600">{p.cantidad}x - Talle {p.talle}, Color {p.color}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditar(p)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"><Edit size={18} /></button>
                            <button onClick={() => handleEliminar(p.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </motion.div>
                )) : <p className="text-gray-500 italic text-center py-4">Aún no has agregado prendas a tu pedido.</p>}
            </AnimatePresence>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
const Paso2Prendas = ({ formData, setFormData, errores, setErrores }) => {
    const [editingId, setEditingId] = useState(null);
    const [combinacion, setCombinacion] = useState({ idPrenda: '', nombrePrenda: '', talle: '', color: '', cantidad: 1 });
    
    const prendaSeleccionada = useMemo(() => PRENDAS_DISPONIBLES.find(p => p.id === combinacion.idPrenda), [combinacion.idPrenda]);

    const resetFormCombinacion = () => {
        setCombinacion({ idPrenda: '', nombrePrenda: '', talle: '', color: '', cantidad: 1 });
        setEditingId(null);
        setErrores({});
    };

    const handleAgregarOActualizar = () => {
        const nuevosErrores = {};
        if (!combinacion.idPrenda) nuevosErrores.idPrenda = 'Seleccione prenda.';
        if (!combinacion.talle) nuevosErrores.talle = 'Seleccione talle.';
        if (!combinacion.color) nuevosErrores.color = 'Seleccione color.';
        if (combinacion.cantidad < 1) nuevosErrores.cantidad = 'Cantidad > 0.';

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        if (editingId) {
            setFormData(prev => ({ ...prev, prendas: prev.prendas.map(p => p.id === editingId ? { ...combinacion, id: p.id } : p) }));
        } else {
            setFormData(prev => ({ ...prev, prendas: [...prev.prendas, { ...combinacion, id: Date.now() }] }));
        }
        resetFormCombinacion();
    };

    const handleEditar = (prendaAEditar) => {
        setEditingId(prendaAEditar.id);
        setCombinacion(prendaAEditar);
        window.scrollTo(0, 0);
    };

    const handleEliminar = (id) => setFormData(prev => ({ ...prev, prendas: prev.prendas.filter(p => p.id !== id) }));
    
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">2. Selección de Prendas</h2>
            <p className="text-gray-600 mb-6">Agregá todas las combinaciones que necesites. Podés editar o eliminar antes de continuar.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <FormularioCombinacion 
                    combinacion={combinacion}
                    setCombinacion={setCombinacion}
                    errores={errores}
                    prendaSeleccionada={prendaSeleccionada}
                    handleAgregarOActualizar={handleAgregarOActualizar}
                    resetFormCombinacion={resetFormCombinacion}
                    editingId={editingId}
                />
                <VistaPreviaPrenda 
                    prendaSeleccionada={prendaSeleccionada}
                    combinacion={combinacion}
                />
            </div>

            <ListaPrendasAgregadas 
                prendas={formData.prendas}
                handleEditar={handleEditar}
                handleEliminar={handleEliminar}
                error={errores.prendas}
            />
        </div>
    );
};

// --- VALIDACIÓN DE PROPS ---
Paso2Prendas.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errores: PropTypes.object.isRequired,
  setErrores: PropTypes.func.isRequired,
};

// PropTypes para los sub-componentes (buena práctica)
FormularioCombinacion.propTypes = {
    combinacion: PropTypes.object.isRequired,
    setCombinacion: PropTypes.func.isRequired,
    errores: PropTypes.object.isRequired,
    prendaSeleccionada: PropTypes.object,
    handleAgregarOActualizar: PropTypes.func.isRequired,
    resetFormCombinacion: PropTypes.func.isRequired,
    editingId: PropTypes.number,
};

VistaPreviaPrenda.propTypes = {
    prendaSeleccionada: PropTypes.object,
    combinacion: PropTypes.object.isRequired,
};

ListaPrendasAgregadas.propTypes = {
    prendas: PropTypes.array.isRequired,
    handleEditar: PropTypes.func.isRequired,
    handleEliminar: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default Paso2Prendas;
// Paso2Prendas.jsx
// Este componente maneja la selección de prendas, permitiendo agregar, editar y eliminar combinaciones de prendas.