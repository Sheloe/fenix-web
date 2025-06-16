import React from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes para la validación de props
import { User, Building, Mail, Phone, Hash } from 'lucide-react';
import CampoInput from '../ui/CampoInput';

// --- CONFIGURACIÓN DE LOS CAMPOS ---
// Aquí definimos la estructura de nuestro formulario.
// Si queremos agregar, quitar o reordenar un campo a futuro, solo tocamos este array.
const camposCliente = [
  {
    id: 'nombre',
    label: 'Nombre y Apellido',
    type: 'text',
    placeholder: 'Juan Pérez',
    icono: <User size={18} />,
    autoComplete: 'name',
    requerido: true,
  },
  {
    id: 'empresa',
    label: 'Empresa',
    type: 'text',
    placeholder: 'Constructora del Sur S.A.',
    icono: <Building size={18} />,
    autoComplete: 'organization',
    requerido: false,
  },
  {
    id: 'email',
    label: 'Email de Contacto',
    type: 'email',
    placeholder: 'juan.perez@email.com',
    icono: <Mail size={18} />,
    autoComplete: 'email',
    requerido: true,
  },
  {
    id: 'whatsapp',
    label: 'Teléfono / WhatsApp',
    type: 'tel',
    placeholder: '+5491122334455',
    icono: <Phone size={18} />,
    autoComplete: 'tel',
    requerido: true,
  },
  {
    id: 'cuitDni',
    label: 'CUIT / DNI',
    type: 'text',
    placeholder: '20-12345678-9',
    icono: <Hash size={18} />,
    autoComplete: 'off', // No queremos que los navegadores guarden esto
    requerido: false,
  },
];

const Paso1Cliente = ({ formData, handleChange, errores }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">1. Datos del Cliente</h2>
      <p className="text-gray-600 mb-6">Necesitamos esta información para poder contactarte.</p>
      
      {/* El formulario ahora se renderiza dinámicamente a partir de la configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {camposCliente.map((campo) => (
          <CampoInput
            key={campo.id}
            id={campo.id}
            label={`${campo.label}${campo.requerido ? ' *' : ' (Opcional)'}`} // Añadimos el indicador visual
            type={campo.type}
            placeholder={campo.placeholder}
            valor={formData.cliente[campo.id]}
            onChange={(e) => handleChange('cliente', campo.id, e.target.value)}
            error={errores[campo.id]}
            icono={campo.icono}
            autoComplete={campo.autoComplete}
          />
        ))}
      </div>
    </div>
  );
};

// --- VALIDACIÓN DE PROPS ---
// Le decimos a React qué props son obligatorias para que este componente funcione.
Paso1Cliente.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errores: PropTypes.object.isRequired,
};

export default Paso1Cliente;
// Este componente Paso1Cliente renderiza un formulario para ingresar los datos del cliente.
// Utiliza un array de configuración para definir los campos, lo que facilita agregar o quitar campos en el futuro.