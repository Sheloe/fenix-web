import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';

const MensajeFinal = ({ tipo, setEstadoEnvio, pedidoId }) => {
  const config = {
    exito: {
      icono: <Check size={48} className="text-green-500" />,
      titulo: "¡Pedido enviado con éxito!",
      mensaje: "Hemos recibido tu solicitud. Nuestro equipo te enviará una cotización detallada a tu correo electrónico en las próximas 24 horas hábiles. ¡Gracias por confiar en Fénix!",
      color: "green"
    },
    error: {
      icono: <AlertTriangle size={48} className="text-red-500" />,
      titulo: "Hubo un error al enviar tu pedido",
      mensaje: "No pudimos procesar tu solicitud. Por favor, intentá de nuevo más tarde o contactanos directamente por WhatsApp.",
      color: "red"
    }
  };
  const { icono, titulo, mensaje } = config[tipo];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 text-center space-y-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>{icono}</motion.div>
        <h3 className="text-2xl font-bold text-gray-900">{titulo}</h3>
        <p className="text-gray-600">{mensaje}</p>

        {tipo === 'exito' && pedidoId && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
            <p className="text-sm text-gray-600">Tu número de referencia de pedido es:</p>
            <p className="text-lg font-mono font-bold text-gray-900 tracking-wider mt-1">{pedidoId}</p>
          </div>
        )}

        {tipo === 'error' ? (
          <button onClick={() => setEstadoEnvio('inicial')} className={`mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors`}>Volver a intentar</button>
        ) : (
          <a href="/" className={`mt-6 inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors`}>Volver al Inicio</a>
        )}
      </motion.div>
    </div>
  );
};

MensajeFinal.propTypes = {
    tipo: PropTypes.oneOf(['exito', 'error']).isRequired,
    setEstadoEnvio: PropTypes.func,
    pedidoId: PropTypes.string
};

export default MensajeFinal;
// Este componente MensajeFinal muestra un mensaje de éxito o error al usuario después de enviar un pedido.
// Utiliza animaciones de Framer Motion para una mejor experiencia visual y es configurable según el tipo de mensaje (éxito o error).