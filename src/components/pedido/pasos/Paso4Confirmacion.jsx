import React from 'react';
import PropTypes from 'prop-types';

// --- Importamos nuestros componentes de UI reutilizables ---
import ResumenSeccion from '../ui/ResumenSeccion';
import DefinicionItem from '../ui/DefinicionItem';

// --- SUB-COMPONENTE 1: Resumen de los datos del cliente ---
const ResumenCliente = ({ cliente }) => (
    <ResumenSeccion titulo="Datos del Cliente">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <DefinicionItem titulo="Nombre" valor={cliente.nombre} />
            <DefinicionItem titulo="Email" valor={cliente.email} />
            {cliente.empresa && <DefinicionItem titulo="Empresa" valor={cliente.empresa} />}
            <DefinicionItem titulo="WhatsApp" valor={cliente.whatsapp} />
        </dl>
    </ResumenSeccion>
);

// --- SUB-COMPONENTE 2: Resumen de las prendas seleccionadas ---
const ResumenPrendas = ({ prendas }) => (
    <ResumenSeccion titulo="Prendas Solicitadas">
        <ul className="list-disc list-inside space-y-1">
            {prendas.map(p => (
                <li key={p.id}>
                    {p.cantidad}x <strong>{p.nombrePrenda}</strong> (Talle: {p.talle}, Color: {p.color})
                </li>
            ))}
        </ul>
    </ResumenSeccion>
);

// --- SUB-COMPONENTE 3: Resumen de los detalles de personalización ---
const ResumenPersonalizacion = ({ personalizacion }) => (
    <ResumenSeccion titulo="Detalles de Personalización">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <DefinicionItem titulo="Tipo de Trabajo" valor={personalizacion.tipoTrabajo} />
            <DefinicionItem titulo="Ubicación" valor={personalizacion.ubicacion} />
            <DefinicionItem titulo="Tamaño" valor={personalizacion.tamano} />
            <DefinicionItem titulo="Diseño" valor={personalizacion.archivo ? `Adjunto: ${personalizacion.archivo.name}` : 'A definir con Fénix'} />
        </dl>
    </ResumenSeccion>
);

// --- SUB-COMPONENTE 4: Checkbox de Términos y Condiciones ---
const AceptacionTerminos = ({ aceptaTerminos, setFormData, error }) => (
    <div className="mt-6">
        <label className="flex items-start">
            <input 
                type="checkbox" 
                checked={aceptaTerminos} 
                onChange={(e) => setFormData(prev => ({ ...prev, aceptaTerminos: e.target.checked }))} 
                className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="ml-3 text-sm text-gray-700">
                He revisado mi pedido y acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 hover:underline">términos y condiciones</a> del servicio.
            </span>
        </label>
        {error && <p className="mt-1 text-xs text-red-600 ml-6">{error}</p>}
    </div>
);

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
const Paso4Confirmacion = ({ formData, setFormData, errores }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">4. Confirmación y Envío</h2>
            <p className="text-gray-600 mb-6">Revisá que todos los datos sean correctos.</p>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                <ResumenCliente cliente={formData.cliente} />
                <ResumenPrendas prendas={formData.prendas} />
                <ResumenPersonalizacion personalizacion={formData.personalizacion} />
            </div>

            <AceptacionTerminos 
                aceptaTerminos={formData.aceptaTerminos}
                setFormData={setFormData}
                error={errores.aceptaTerminos}
            />

            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                <p><strong>Paso final:</strong> Al enviar este formulario, recibirás una cotización detallada en tu email en las próximas 24 horas hábiles. Este formulario no genera una orden de compra.</p>
            </div>
        </div>
    );
};

// --- VALIDACIÓN DE PROPS ---
Paso4Confirmacion.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errores: PropTypes.object.isRequired,
};

// PropTypes para los sub-componentes (buena práctica)
ResumenCliente.propTypes = { cliente: PropTypes.object.isRequired };
ResumenPrendas.propTypes = { prendas: PropTypes.array.isRequired };
ResumenPersonalizacion.propTypes = { personalizacion: PropTypes.object.isRequired };
AceptacionTerminos.propTypes = {
    aceptaTerminos: PropTypes.bool.isRequired,
    setFormData: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default Paso4Confirmacion;
// Este componente Paso4Confirmacion muestra un resumen del pedido y permite al usuario confirmar los datos antes de enviarlo.
// También incluye un checkbox para aceptar los términos y condiciones, y un mensaje informativo sobre el proceso de cotización.