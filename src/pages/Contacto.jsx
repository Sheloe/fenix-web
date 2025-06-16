import React from 'react';
import { Link } from 'react-router-dom';

const Contacto = () => {
  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Contacto y Ayuda</h1>

      <div className="space-y-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">¿Cómo podemos ayudarte?</h2>
          <p className="text-gray-700">Si tenés dudas sobre un pedido, productos, estampados o bordados, podés escribirnos por WhatsApp, llamarnos o mandarnos un email.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="font-semibold mb-2">📞 Teléfono / WhatsApp</h3>
          <a
            href="https://wa.me/5492364611100"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            +54 9 236 4611100
          </a>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="font-semibold mb-2">✉️ Correo electrónico</h3>
          <a
            href="mailto:ventas.fenixropadetrabajo@gmail.com"
            className="text-blue-600 hover:underline"
          >
            ventas.fenixropadetrabajo@gmail.com
          </a>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="font-semibold mb-2">📍 Dirección</h3>
          <p className="text-gray-700">Junín, Buenos Aires (Entrega local y envíos a todo el país)</p>
          <p className="text-gray-700">Rivadavia 1161 (Esquina Libertad)</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="font-semibold mb-2">⏰ Horarios de atención</h3>
          <p className="text-gray-700">Lunes a Viernes de 9:00 a 13:00 y de 16:00 a 20:00 hs</p>
          <p className="text-gray-700">
            Sábados de 9:00 a 13:00 y de <strong>17:00</strong> a 20:00 hs
          </p>
          <p className="text-gray-700">Domingos Cerrado</p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        También podés consultar la sección{" "}
        <Link to="/seguimiento" className="text-blue-600 hover:underline font-medium">
          Seguimiento
        </Link>{" "}
        para ver el estado de tu pedido.
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-2">📲 Seguinos en redes sociales</h3>
        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://www.facebook.com/tu-pagina"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/fenixjunin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
