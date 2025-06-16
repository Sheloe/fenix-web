// src/firebaseConfig.js

// 1. Importaciones necesarias de los SDKs de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <-- ¡IMPORTACIÓN CLAVE AGREGADA!

// 2. Tu configuración de Firebase (sin cambios)
const firebaseConfig = {
  apiKey: "AIzaSyBjAoLosxWQ7jrpIDig9Wxuuii4mqZQYyk",
  authDomain: "fenix-sfgo.firebaseapp.com",
  projectId: "fenix-sfgo",
  storageBucket: "fenix-sfgo.firebasestorage.app",
  messagingSenderId: "112410047692",
  appId: "1:112410047692:web:1d39ac099af09774bcfe69",
  measurementId: "G-V90T3DWDKB"
};

// 3. Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// 4. Obtiene una referencia a los servicios que vamos a usar
const db = getFirestore(app);       // Para la base de datos Firestore
const auth = getAuth(app);      // Para el servicio de Autenticación

// 5. Exporta las instancias para que puedan ser usadas en otros archivos
export { db, auth };
