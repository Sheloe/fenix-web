import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CampoInput = ({ id, label, type, placeholder, valor, onChange, error, icono }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icono}</span>
            <input type={type} id={id} name={id} placeholder={placeholder} value={valor} onChange={onChange} className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${error ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
        </div>
        <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</motion.p>}</AnimatePresence>
    </div>
);

export default CampoInput;