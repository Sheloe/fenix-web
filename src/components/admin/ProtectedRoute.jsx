// src/components/admin/ProtectedRoute.jsx
// Versión actualizada y segura usando UID (Identificador Único de Usuario) en lugar de email.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- LISTA DE UIDs DE ADMINISTRADORES AUTORIZADOS ---
// ¡MUCHO MÁS SEGURO! Estos UIDs no revelan información personal.
// Reemplazá el valor de ejemplo con el UID que copiaste de la consola de Firebase.
const ALLOWED_ADMIN_UIDS = [
  "dXEvLev3x1cmmbpCyIRyjGKyPd83", // Reemplazá con tu UID de administrador real.
  // Podés encontrar tu UID en la consola de Firebase, en la sección de Autenticación.
  // Si en el futuro tenés otro administrador, agregarías su UID aquí en una nueva línea:
  // , "OTRO_UID_DE_ADMIN_SI_LO_HUBIERA" 
];

const ProtectedRoute = ({ children, adminOnly = true }) => {
  const { user } = useAuth(); // Obtenemos el objeto 'user' completo.

  // Si no hay un usuario logueado, lo redirigimos a la página de login.
  if (!user) {
    // Si la ruta es solo para admins, mandamos al login de admin.
    // Si no, podríamos tener un /login para clientes.
    return <Navigate to="/admin/login" replace />;
  }

  // Si la ruta requiere ser administrador (como el dashboard)
  if (adminOnly) {
    // Verificamos que el UID del usuario logueado esté en nuestra lista segura.
    const isAuthorized = ALLOWED_ADMIN_UIDS.includes(user.uid);

    if (!isAuthorized) {
      // Si el usuario está logueado pero su UID no está en la lista de admins,
      // no tiene permiso. Lo mandamos al login o a la home.
      return <Navigate to="/admin/login" replace />;
    }
  }

  // Si se cumple todo (usuario logueado y, si es necesario, es admin),
  // le permitimos ver el contenido (la página protegida).
  return children;
};

export default ProtectedRoute;