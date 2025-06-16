import React from 'react';
import PropTypes from 'prop-types';

const ResumenSeccion = ({ titulo, children }) => (
    <div>
        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">{titulo}</h4>
        <div className="text-sm text-gray-600 space-y-1">{children}</div>
    </div>
);

ResumenSeccion.propTypes = {
    titulo: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default ResumenSeccion;
// Este componente ResumenSeccion es una sección de resumen que muestra un título y su contenido.
// Se utiliza para agrupar información relacionada en el resumen de un pedido, con un estilo limpio y moderno.