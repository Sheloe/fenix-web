import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 group flex flex-col"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={`Imagen de ${product.name}`}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-red-600 font-semibold mb-1">{product.category}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex-grow">{product.name}</h3>
        <Link
          to={`/productos/${slug}`}
          className="mt-auto block w-full text-center bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          Ver Detalles
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
