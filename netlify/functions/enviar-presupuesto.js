// netlify/functions/enviar-presupuesto.js - VERSIÓN 2.0 (Robusta y Validada)

// La dependencia 'emailjs-com' debe estar en el package.json principal de tu proyecto.
const emailjs = require('emailjs-com');

exports.handler = async function (event) {
  // --- MEJORA 1: Validar el método HTTP ---
  // Nos aseguramos de que solo se pueda llamar a esta función usando POST.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido.' }) };
  }

  try {
    // --- MEJORA 2: Manejo de errores al parsear la entrada ---
    // Si el frontend envía algo que no es un JSON válido, no se romperá la función.
    const { templateParams } = JSON.parse(event.body);

    // --- MEJORA 3 (LA MÁS IMPORTANTE): Validación de datos de entrada ---
    // Verificamos que los datos necesarios para la plantilla de EmailJS realmente existan.
    if (!templateParams || !templateParams.to_email || !templateParams.to_name || !templateParams.message) {
      console.warn("Intento de envío con datos incompletos:", templateParams);
      return {
        statusCode: 400, // 400 Bad Request: error del cliente.
        body: JSON.stringify({ error: 'Faltan parámetros requeridos para enviar el email.' }),
      };
    }
    
    // Opcional: una validación un poco más específica para el formato del email.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(templateParams.to_email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'El formato del email no es válido.' }),
        };
    }

    // Obtención de claves secretas (sin cambios, ya era seguro)
    const serviceID = process.env.EMAILJS_SERVICE_ID;
    const templateID = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      console.error("Error crítico: Faltan las variables de entorno de EmailJS en Netlify.");
      return { statusCode: 500, body: JSON.stringify({ error: 'Error de configuración del servidor.' }) };
    }

    // Llamada a EmailJS (sin cambios)
    await emailjs.send(serviceID, templateID, templateParams, publicKey);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email enviado correctamente.' }),
    };

  } catch (error) {
    // El 'catch' ahora puede atrapar errores de JSON.parse o de la llamada a emailjs.send.
    console.error('Error general en la función:', error);
    
    // Distinguimos si el error fue de EmailJS o de otra cosa (como un JSON malformado)
    if (error.status) {
         return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error del servicio de email: ${error.text}` }),
        };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'La solicitud está mal formada.' }) };
  }
};