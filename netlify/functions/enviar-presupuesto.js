// netlify/functions/enviar-presupuesto.js

// NOTA: No necesitás instalar 'node-fetch'. Netlify lo provee.
// En tu terminal, en la raíz del proyecto, instalá la librería de emailjs:
// npm install emailjs-com

const emailjs = require('emailjs-com');

exports.handler = async function (event, context) {
  // Solo permitimos que se llame a esta función con el método POST.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Los datos vienen del body del request de 'fetch'.
  const { templateParams } = JSON.parse(event.body);

  // --- OBTENCIÓN SEGURA DE LAS CLAVES DESDE NETLIFY ---
  // Estas son las variables de entorno que configurarás en el Paso 3.
  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceID || !templateID || !publicKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'El servidor no está configurado para enviar emails.' }),
    };
  }

  try {
    // La misma llamada a EmailJS, pero desde un entorno seguro.
    await emailjs.send(serviceID, templateID, templateParams, publicKey);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email enviado correctamente.' }),
    };

  } catch (error) {
    console.error('Error al enviar email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `No se pudo enviar el email. Status: ${error.status} - Text: ${error.text}` }),
    };
  }
};