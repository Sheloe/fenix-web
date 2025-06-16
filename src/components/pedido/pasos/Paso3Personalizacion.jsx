import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';

// --- Reutilizamos los componentes de UI que ya creamos ---
import RadioInput from '../ui/RadioInput';
import SelectInput from '../ui/SelectInput';

// --- CONFIGURACIÓN DE LOS SELECTS ---
// Centralizamos las opciones para que sea fácil modificarlas a futuro.
const TIPOS_PERSONALIZACION = ['Estampado (Serigrafía)', 'Estampado (DTF)', 'Bordado'];
const UBICACIONES_DISENO = ['Pecho Izquierdo', 'Pecho Derecho', 'Frente (Centro)', 'Espalda (Superior)', 'Manga Izquierda', 'Manga Derecha'];
const TAMANOS_DISENO = ['Chico (hasta 10x10cm)', 'Mediano (hasta 15x15cm)', 'Grande (hasta 20x20cm)', 'Extra Grande (hasta 30x30cm)'];


// --- SUB-COMPONENTE 1: Selector de Diseño Propio ---
const OpcionDisenoPropio = ({ tieneDiseno, handleChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">¿Tenés un diseño propio?</label>
        <div className="flex flex-col sm:flex-row gap-4">
            <RadioInput name="tieneDiseno" valor="si" checked={tieneDiseno === 'si'} onChange={(e) => handleChange('personalizacion', 'tieneDiseno', e.target.value)}>
                Sí, quiero subir mi logo/diseño
            </RadioInput>
            <RadioInput name="tieneDiseno" valor="no" checked={tieneDiseno === 'no'} onChange={(e) => handleChange('personalizacion', 'tieneDiseno', e.target.value)}>
                No, necesito ayuda con el diseño
            </RadioInput>
        </div>
    </div>
);

// --- SUB-COMPONENTE 2: Uploader de Archivo Condicional ---
const UploaderArchivo = ({ archivo, handleFileChange, error }) => (
    <AnimatePresence>
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 mb-2">Subir archivo (PDF, AI, PNG, JPG)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="archivo-input" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                            <span>{archivo ? `Archivo: ${archivo.name}` : 'Seleccionar un archivo'}</span>
                            <input id="archivo-input" name="archivo" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg" />
                        </label>
                        {!archivo && <p className="pl-1">o arrastrar y soltar</p>}
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, SVG, PDF, AI, EPS</p>
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </motion.div>
    </AnimatePresence>
);

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
const Paso3Personalizacion = ({ formData, handleChange, errores }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleChange('personalizacion', 'archivo', file);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">3. Detalles de Personalización</h2>
            <p className="text-gray-600 mb-6">Contanos cómo querés tu logo en las prendas.</p>
            
            <div className="space-y-6">
                <OpcionDisenoPropio 
                    tieneDiseno={formData.personalizacion.tieneDiseno}
                    handleChange={handleChange}
                />

                {formData.personalizacion.tieneDiseno === 'si' && (
                    <UploaderArchivo 
                        archivo={formData.personalizacion.archivo}
                        handleFileChange={handleFileChange}
                        error={errores.archivo}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectInput 
                        id="tipoTrabajo" 
                        label="Tipo de Trabajo" 
                        valor={formData.personalizacion.tipoTrabajo} 
                        onChange={(e) => handleChange('personalizacion', 'tipoTrabajo', e.target.value)} 
                        opciones={TIPOS_PERSONALIZACION} 
                        error={errores.tipoTrabajo} 
                    />
                    <SelectInput 
                        id="ubicacion" 
                        label="Ubicación del Diseño" 
                        valor={formData.personalizacion.ubicacion} 
                        onChange={(e) => handleChange('personalizacion', 'ubicacion', e.target.value)} 
                        opciones={UBICACIONES_DISENO} 
                        error={errores.ubicacion} 
                    />
                    <SelectInput 
                        id="tamano" 
                        label="Tamaño del Diseño" 
                        valor={formData.personalizacion.tamano} 
                        onChange={(e) => handleChange('personalizacion', 'tamano', e.target.value)} 
                        opciones={TAMANOS_DISENO} 
                        error={errores.tamano} 
                    />
                </div>
            </div>
        </div>
    );
};

// --- VALIDACIÓN DE PROPS ---
Paso3Personalizacion.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errores: PropTypes.object.isRequired,
};

// PropTypes para los sub-componentes
OpcionDisenoPropio.propTypes = {
    tieneDiseno: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

UploaderArchivo.propTypes = {
    archivo: PropTypes.object,
    handleFileChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default Paso3Personalizacion;
// Este componente Paso3Personalizacion es parte del flujo de pedido y permite al usuario especificar los detalles de personalización de su pedido.
// Incluye opciones para subir un diseño propio, seleccionar tipo de trabajo, ubicación y tamaño del diseño.