// src/pages/admin/Login.jsx
// Este archivo fusiona el diseño de tu versión original con la lógica de autenticación segura de Firebase, ahora incluyendo Login con Google.

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Mail, Loader } from 'lucide-react';

// Componente SVG para el ícono de Google para no depender de librerías externas.
const GoogleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,34.627,44,29.625,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


const Login = () => {
    // Estados para el email, la contraseña, el error y el estado de carga
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Obtenemos las funciones de login de nuestro AuthContext y el hook para navegar
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    // Manejador del formulario para login con email/contraseña
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Email o contraseña incorrectos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };
    
    // Manejador para el botón de login con Google
    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/admin/dashboard');
        } catch (err) {
            setError('No se pudo iniciar sesión con Google. Intente de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <img src="/assets/fenix-logo.png" alt="Logo de Fénix" className="w-24 h-24 mx-auto mb-4"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/b91c1c/white?text=F' }}
                    />
                    <h1 className="text-3xl font-bold text-gray-900">Acceso Interno</h1>
                    <p className="text-gray-500">Panel de Gestión de Pedidos</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                            required disabled={loading} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                            required disabled={loading} />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button type="submit" className="w-full flex justify-center items-center py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400" disabled={loading}>
                        {loading ? (<Loader className="animate-spin mr-2" />) : (<LogIn className="mr-2" />)}
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
                
                <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">o</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full flex justify-center items-center py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-200" disabled={loading}>
                    <GoogleIcon className="mr-3" />
                    Ingresar con Google
                </button>
            </div>
        </div>
    );
};

export default Login;
// Este componente de Login ahora incluye la lógica para iniciar sesión con Google,
// manteniendo la estructura y el estilo de tu diseño original.