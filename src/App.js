import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// --- Componentes de páginas públicas ---
import { default as Home } from './pages/Home';
import { default as Pedido } from './pages/Pedido';
import { default as Catalogo } from './pages/Catalogo';
import { default as Seguimiento } from './pages/Seguimiento';
import { default as Contacto } from './pages/Contacto';
import { default as GuiaTalles } from './pages/GuiaTalles';
import { default as ProductDetail } from './pages/ProductDetail';
import { default as LibroDeQuejas } from './pages/LibroDeQuejas';

// --- Arquitectura de autenticación y admin ---
import { AuthProvider } from './context/AuthContext';
import { default as Login } from './pages/admin/Login';
import { default as DashboardPedidos } from './pages/admin/DashboardPedidos';
import { default as DashboardQuejas } from './pages/admin/DashboardQuejas'; // <-- 1. IMPORTA LA NUEVA PÁGINA
import { default as DetallePedidoDashboard } from './pages/admin/DetallePedidoDashboard';
import { default as ProtectedRoute } from './components/admin/ProtectedRoute';
import { default as DetalleQuejaDashboard } from './pages/admin/DetalleQuejaDashboard';
import { default as EditarPedidoDashboard } from './pages/admin/EditarPedidoDashboard';

function App() {
  return (
    <AuthProvider>
        <nav className="bg-red-600 p-4 text-white flex flex-col gap-2 md:flex-row md:items-center md:justify-center md:space-x-6 shadow-md">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/pedido" className="hover:underline">Pedido</Link>
          <Link to="/catalogo" className="hover:underline">Catálogo</Link>
          <Link to="/seguimiento" className="hover:underline">Seguimiento</Link>
          <Link to="/contacto" className="hover:underline">Contacto</Link>
          <Link to="/guia-de-talles" className="hover:underline">Guía de Talles</Link>
          <Link to="/admin/login" className="text-sm text-red-200 hover:text-white">Admin</Link>
        </nav>
        <main>
          <Routes>
            {/* --- Rutas Públicas --- */}
            <Route path="/" element={<Home />} />
            <Route path="/pedido" element={<Pedido />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/guia-de-talles" element={<GuiaTalles />} />
            <Route path="/producto/:slug" element={<ProductDetail />} />
            <Route path="/libro-de-quejas" element={<LibroDeQuejas />} />


            {/* --- Rutas de Admin Protegidas --- */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPedidos /></ProtectedRoute>} />
            <Route path="/admin/dashboard/pedido/:pedidoId" element={<ProtectedRoute><DetallePedidoDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard/queja/:quejaId" element={<ProtectedRoute><DetalleQuejaDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard/pedido/:pedidoId/editar" element={<ProtectedRoute><EditarPedidoDashboard /></ProtectedRoute>}  />
            
            {/* --- 2. AÑADE LA NUEVA RUTA PROTEGIDA PARA QUEJAS --- */}
            <Route path="/admin/dashboard/quejas" element={<ProtectedRoute><DashboardQuejas /></ProtectedRoute>} />
          </Routes>
        </main>
    </AuthProvider>
  );
}
export default App;