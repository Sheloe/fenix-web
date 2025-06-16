import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const BarraProgreso = ({ pasoActual }) => {
    const pasos = ["Cliente", "Prendas", "Diseño", "Confirmar"];
    return (
        <div className="flex items-center justify-center mb-10">
            {pasos.map((paso, index) => (
                <React.Fragment key={paso}>
                    <div className="flex flex-col items-center text-center w-20">
                        <motion.div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300 ${pasoActual > index + 1 ? 'bg-green-500 border-green-500 text-white' : pasoActual === index + 1 ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`} animate={{ scale: pasoActual === index + 1 ? 1.15 : 1 }} transition={{ type: 'spring' }}>
                            {pasoActual > index + 1 ? <Check size={20} /> : index + 1}
                        </motion.div>
                        <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors ${pasoActual >= index + 1 ? 'text-gray-800' : 'text-gray-400'}`}>{paso}</p>
                    </div>
                    {index < pasos.length - 1 && <div className={`flex-auto border-t-2 transition-colors duration-500 mx-2 sm:mx-4 ${pasoActual > index + 1 ? 'border-green-500' : 'border-gray-300'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default BarraProgreso;
// Este componente BarraProgreso muestra una barra de progreso con pasos numerados y nombres.
// Cada paso cambia de color según el estado actual del proceso, con animaciones suaves al cambiar de paso.