// src/context/AuthContext.jsx
// Versión actualizada que incluye el proveedor de Google.

import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider, // Importación para el proveedor de Google
  signInWithPopup   // Importación para la ventana emergente de login
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // NUEVA FUNCIÓN: Lógica para el login con Google
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const value = {
    user,
    isLoggedIn: user !== null,
    login,
    loginWithGoogle, // Exportamos la nueva función
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
// src/context/AuthContext.jsx
// src/context/AuthContext.jsx