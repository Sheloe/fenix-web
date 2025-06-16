import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ActionCard = ({ icon, title, description, to }) => {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link
        to={to}
        className="group block p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-transparent hover:border-red-600 h-full"
      >
        <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full text-gray-800 group-hover:bg-red-100 group-hover:text-red-600 transition-colors duration-300">
          {React.cloneElement(icon, { className: "w-8 h-8" })}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </Link>
    </motion.div>
  );
};

export default ActionCard;
