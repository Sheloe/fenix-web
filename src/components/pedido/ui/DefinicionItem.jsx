import React from 'react';
import PropTypes from 'prop-types';

const DefinicionItem = ({ titulo, valor }) => (
    <div>
      <dt className="text-sm font-medium text-gray-500">{titulo}</dt>
      <dd className="mt-1 text-sm text-gray-900">{valor || '-'}</dd>
    </div>
);

DefinicionItem.propTypes = {
    titulo: PropTypes.string.isRequired,
    valor: PropTypes.string,
};

export default DefinicionItem;
// Este componente DefinicionItem es una unidad de definición que muestra un título y su valor asociado.
// Se utiliza para mostrar información clave en un formato limpio y legible, ideal para resúmenes o detalles de pedidos.