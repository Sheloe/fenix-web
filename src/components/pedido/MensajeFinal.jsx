import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, Send, Mail } from 'lucide-react';

const MensajeFinal = ({ tipo, setEstadoEnvio, pedidoId, formData }) => {
  const config = {
    exito: {
      icono: <Check size={48} className="text-green-500" />,
      titulo: "¡Pedido enviado con éxito!",
      mensaje: "Hemos recibido tu solicitud. Nuestro equipo te enviará una cotización detallada a tu correo electrónico en las próximas 24 horas hábiles.",
    },
    error: {
      icono: <AlertTriangle size={48} className="text-red-500" />,
      titulo: "Hubo un error al enviar tu pedido",
      mensaje: "No pudimos procesar tu solicitud. Por favor, intentá de nuevo más tarde o contactanos directamente por WhatsApp.",
    }
  };
  
  // Se extraen los datos de configuración para el tipo de mensaje actual (éxito o error)
  const { icono, titulo, mensaje } = config[tipo];

  // Preparamos los links para que sea fácil para el cliente enviar sus archivos
  const numeroWhatsApp = "5492364611100"; // Tu número de WhatsApp
  const emailContacto = "ventas.fenixropadetrabajo@gmail.com"; // Tu email
  const asuntoEmail = `Diseño para Pedido #${pedidoId}`;
  const cuerpoEmail = `¡Hola! Adjunto mi diseño para el pedido con referencia #${pedidoId}.\n\nCliente: ${formData?.cliente?.nombre}\n\n¡Gracias!`;
  const textoWhatsApp = `¡Hola! Te envío mi diseño para el pedido con referencia #${pedidoId}. Mi nombre es ${formData?.cliente?.nombre}.`;
  
  // Codificamos los textos para que funcionen correctamente en las URLs
  const mailtoLink = `mailto:${emailContacto}?subject=${encodeURIComponent(asuntoEmail)}&body=${encodeURIComponent(cuerpoEmail)}`;
  const whatsappLink = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ type: 'spring', stiffness: 200, damping: 20 }} 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center space-y-4"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>{icono}</motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900">{titulo}</h3>
        <p className="text-gray-600">{mensaje}</p>

        {tipo === 'exito' && pedidoId && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
            <p className="text-sm text-gray-600">Tu número de referencia de pedido es:</p>
            <p className="text-lg font-mono font-bold text-gray-900 tracking-wider mt-1">{pedidoId}</p>
          </div>
        )}

        {/* --- SECCIÓN INTELIGENTE: SOLO APARECE SI HAY UN DISEÑO PENDIENTE --- */}
        {tipo === 'exito' && formData?.personalizacion?.tieneDiseno === 'si' && (
            <div className="mt-6 p-4 bg-blue-50 border-t-4 border-blue-400 text-left rounded-b-lg shadow-inner">
                <h4 className="font-bold text-blue-900 text-lg">Siguientes Pasos: Tu Diseño</h4>
                <p className="text-sm text-blue-800 mt-2">
                    Para continuar, por favor envianos tu archivo de diseño por uno de estos medios. **No olvides incluir tu nombre y el N° de pedido.**
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 btn btn-secundario !bg-green-500 !text-white !border-green-600 hover:!bg-green-600 flex items-center justify-center gap-2">
                        <Send size={16} /> Enviar por WhatsApp
                    </a>
                    <a href={mailtoLink} target="_blank" rel="noopener noreferrer" className="flex-1 btn btn-secundario !bg-gray-600 !text-white !border-gray-700 hover:!bg-gray-700 flex items-center justify-center gap-2">
                        <Mail size={16} /> Enviar por Email
                    </a>
                </div>
            </div>
        )}

        {tipo === 'error' ? (
          <button onClick={() => setEstadoEnvio('inicial')} className="mt-6 btn btn-primario">Volver a intentar</button>
        ) : (
          <a href="/" className="mt-6 inline-block btn btn-primario !bg-green-600 hover:!bg-green-700">Volver al Inicio</a>
        )}
      </motion.div>
    </div>
  );
};

// Se actualizan las propTypes para incluir el nuevo 'formData'
MensajeFinal.propTypes = {
    tipo: PropTypes.oneOf(['exito', 'error']).isRequired,
    setEstadoEnvio: PropTypes.func,
    pedidoId: PropTypes.string,
    formData: PropTypes.object,
};

export default MensajeFinal;