import React from 'react';

const SelectInput = ({ id, label, valor, onChange, opciones, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select id={id} value={valor} onChange={onChange} className={`w-full p-2 border rounded-lg transition-colors ${error ? 'border-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`}>
            <option value="">-- Seleccionar --</option>
            {opciones.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

export default SelectInput;