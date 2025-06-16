import React from 'react';

const RadioInput = ({ name, valor, checked, onChange, children }) => (
    <label className={`flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-red-50 border-red-500 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}>
        <input type="radio" name={name} value={valor} checked={checked} onChange={onChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" />
        <span className="ml-3 text-sm font-medium text-gray-800">{children}</span>
    </label>
);

export default RadioInput;
// Este componente RadioInput es un input de tipo radio estilizado para ser usado en formularios.
// Permite seleccionar una opción entre varias, con un diseño limpio y moderno.