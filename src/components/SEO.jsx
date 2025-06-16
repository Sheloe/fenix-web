// src/components/SEO.jsx
// Este componente centraliza toda la lógica de SEO y redes sociales.

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, ogUrl }) => {
  // --- Valores por defecto (Fallback) ---
  // Si no se proporciona una prop, se usarán estos valores genéricos de Fénix.
  const defaultTitle = 'Fénix Ropa de Trabajo y Calzado de Seguridad | Junín';
  const defaultDescription = 'Líderes en venta de indumentaria laboral, EPP y servicios de estampado y bordado para empresas. Calidad y asesoramiento en Junín, Argentina.';
  const defaultImage = 'https://www.fenix-indumentaria.com.ar/og-image-default.jpg'; // IMPORTANTE: Debes crear y subir esta imagen
  const siteUrl = 'https://www.fenix-indumentaria.com.ar'; // IMPORTANTE: Reemplazar con tu dominio real
  const defaultKeywords = 'ropa de trabajo, calzado de seguridad, fénix, junín, epp, bordado, estampado';
  
  // --- Construcción de los valores finales ---
  const finalTitle = title ? `${title} | Fénix Indumentaria` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = ogImage || defaultImage;
  const finalUrl = ogUrl ? `${siteUrl}${ogUrl}` : siteUrl;
  const finalKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;

  return (
    <Helmet>
      {/* --- Etiquetas Fundamentales para SEO --- */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalUrl} />

      {/* --- Etiquetas Open Graph (para Facebook, WhatsApp, etc.) --- */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Fénix Ropa de Trabajo" />

      {/* --- Etiquetas Twitter Cards (opcional, pero buena práctica) --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};

export default SEO;
// --- NOTA IMPORTANTE ---
// Este componente SEO debe ser importado y utilizado en cada página de tu aplicación.