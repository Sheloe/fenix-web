import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Loader } from 'lucide-react';
import SEO from '../../components/SEO';

const DetalleQuejaDashboard = () => {
  const { quejaId } = useParams();
  const navigate = useNavigate();
  const [queja, setQueja] = useState(null);
  const [estado, setEstado] = useState('');
  const [notaNueva, setNotaNueva] = useState('');
  const [notasInternas, setNotasInternas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueja = async () => {
      try {
        const ref = doc(db, 'quejas', quejaId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setQueja(data);
          setEstado(data.estado);
          setNotasInternas(data.notasInternas || []);
          setLoading(false);

          if (!data.leido) {
            await updateDoc(ref, { leido: true });
          }
        } else {
          navigate('/admin/dashboard/quejas');
        }
      } catch (error) {
        console.error('Error al cargar queja:', error);
        navigate('/admin/dashboard/quejas');
      }
    };

    fetchQueja();
  }, [quejaId, navigate]);

  const handleAgregarNota = async () => {
    if (!notaNueva.trim()) return alert('La nota está vacía.');

    const nuevaNota = {
      texto: notaNueva.trim(),
      fecha: new Date().toLocaleString('es-AR')
    };

    try {
      const ref = doc(db, 'quejas', quejaId);
      await updateDoc(ref, {
        notasInternas: arrayUnion(nuevaNota)
      });
      setNotasInternas(prev => [...prev, nuevaNota]);
      setNotaNueva('');
    } catch (error) {
      console.error('Error al agregar nota:', error);
      alert('Error al agregar la nota.');
    }
  };

  const handleGuardarEstado = async () => {
    try {
      const ref = doc(db, 'quejas', quejaId);
      await updateDoc(ref, { estado });
      alert('Estado actualizado.');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el estado.');
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader className="mx-auto animate-spin" /></div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <SEO title="Reclamo Detallado" description="Detalle y gestión de reclamos | Fénix" />
      <h1 className="text-2xl font-bold mb-6">Detalle del Reclamo</h1>

      <div className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <p><strong>Nombre:</strong> {queja.nombreCompleto}</p>
          <p><strong>Email:</strong> {queja.email}</p>
          <p><strong>Teléfono:</strong> {queja.telefono}</p>
          <p><strong>Tipo de reclamo:</strong> {queja.tipoReclamo}</p>
          {queja.idPedidoAsociado && <p><strong>ID Pedido Asociado:</strong> {queja.idPedidoAsociado}</p>}
          <p><strong>Descripción:</strong> {queja.descripcion}</p>
        </div>

        <div>
          <label className="font-semibold">Estado</label>
          <select
            className="block w-full p-2 border mt-1 rounded"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option>Nuevo</option>
            <option>En revisión</option>
            <option>Resuelto</option>
            <option>Cerrado</option>
          </select>
          <button
            onClick={handleGuardarEstado}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar estado
          </button>
        </div>

        <div>
          <label className="font-semibold">Agregar Nota Interna</label>
          <textarea
            className="block w-full p-2 border mt-1 rounded"
            rows="3"
            value={notaNueva}
            onChange={(e) => setNotaNueva(e.target.value)}
          />
          <button
            onClick={handleAgregarNota}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Agregar nota
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Historial de Notas Internas</h3>
          {notasInternas.length === 0 ? (
            <p className="text-gray-500">Sin notas aún.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {notasInternas.map((nota, idx) => (
                <li key={idx} className="bg-gray-100 p-2 rounded">
                  <p className="text-gray-700">{nota.texto}</p>
                  <p className="text-gray-400 text-xs">{nota.fecha}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <a href={`mailto:${queja.email}`} className="text-blue-600 underline">Enviar email</a>
          <a href={`https://wa.me/${queja.telefono}`} className="text-green-600 underline" target="_blank" rel="noreferrer">Contactar por WhatsApp</a>
          <button
            onClick={() => navigate('/admin/dashboard/quejas')}
            className="text-gray-600 hover:text-black underline"
          >
            ← Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleQuejaDashboard;
// This code defines a React component for displaying and managing the details of a customer complaint (queja) in an admin dashboard.
// It includes functionality to view complaint details, update its status, add internal notes, and contact the customer via email or WhatsApp.