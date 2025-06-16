import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp, collection, getDocs, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ajusta esta ruta si es necesario

import { motion } from 'framer-motion';
import SEO from '../../components/SEO'; // Ajusta esta ruta si es necesario
import { Loader } from 'lucide-react'; // Importado del código antiguo

// Para notificaciones toast
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes reutilizables de tu flujo de pedido (Asegúrate de que estas rutas sean EXACTAS)
import Paso2Prendas from '../../components/pedido/pasos/Paso2Prendas';
import Paso3Personalizacion from '../../components/pedido/pasos/Paso3Personalizacion';
import Paso4Confirmacion from '../../components/pedido/pasos/Paso4Confirmacion';

// Asumiendo que tienes un contexto de autenticación
import { useAuth } from '../../context/AuthContext'; // Ajusta esta ruta según tu implementación

const EditarPedidoDashboard = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario autenticado para la trazabilidad

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(2); // Inicia en el Paso 2 para edición de prendas/personalización

  // --- NUEVO ESTADO UNIFICADO PARA LOS DATOS DEL FORMULARIO DE LOS PASOS ---
  const [formData, setFormData] = useState({
    prendas: [],
    personalizacion: { // Inicializa con estructura para evitar errores al acceder a propiedades anidadas
      tieneDiseno: 'no', // Default value, adjust as needed
      archivo: null,
      tipoTrabajo: '',
      ubicacion: '',
      tamano: ''
    },
    cliente: {} // Solo para visualización en el Paso 4, no editable
  });
  const [errores, setErrores] = useState({}); // Estado para manejar errores de validación de los pasos

  // Estado para el estado del pedido y notas internas (del código antiguo)
  const [estado, setEstado] = useState('');
  const [notaInterna, setNotaInterna] = useState('');

  // Estado para guardar las prendas iniciales cargadas, útil para detectar eliminaciones
  const [initialPrendasLoaded, setInitialPrendasLoaded] = useState([]);

  // useEffect para cargar los datos del pedido al montar el componente o cambiar pedidoId
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const refPedido = doc(db, 'pedidos', pedidoId);
        const snap = await getDoc(refPedido);

        if (!snap.exists()) {
          setError('Pedido no encontrado.');
          toast.error('Pedido no encontrado.');
          navigate('/admin/dashboard'); // Redirige si el pedido no existe
          return;
        }

        const data = snap.data();

        // Obtener items de la subcolección
        const itemsRef = collection(db, 'pedidos', pedidoId, 'items');
        const itemsSnap = await getDocs(itemsRef);
        const prendasCargadas = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Actualizar el estado unificado formData
        setFormData({
          prendas: prendasCargadas,
          personalizacion: data.personalizacion || {}, // Asegura que sea un objeto vacío si no existe
          cliente: data.cliente || {} // Carga los datos del cliente, solo para visualización
        });
        setInitialPrendasLoaded(prendasCargadas); // Guarda las prendas iniciales para detección de eliminaciones

        setEstado(data.estado || 'Nuevo'); // Precarga estado existente, por defecto 'Nuevo'

      } catch (err) {
        console.error('Error al cargar el pedido:', err);
        setError('Error al cargar el pedido.');
        toast.error('Error al cargar el pedido.');
        navigate('/admin/dashboard'); // Redirige en caso de error de carga
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [pedidoId, navigate]); // Dependencias: pedidoId y navigate para refetch y redirección

  // Handlers para navegación entre pasos del formulario
  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePreviousStep = () => setCurrentStep(prev => prev - 1);

  // Función genérica para actualizar el formData en los pasos del formulario
  // `section` puede ser 'prendas' o 'personalizacion'
  // `field` es la propiedad dentro de esa sección
  // `value` es el nuevo valor
  const handleStepInputChange = useCallback((section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Limpiar error específico si se corrige
    if (errores[field]) {
      setErrores(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errores]);

  // Handler para guardar las modificaciones del formulario de pasos (prendas, personalización)
  const handleSubmitEditForm = async () => {
    try {
      setLoading(true);

      // --- Validación de datos antes de guardar (mínima) ---
      if (formData.prendas.length === 0) {
        toast.error('Debe haber al menos una prenda en el pedido para confirmar la edición.');
        setLoading(false);
        return;
      }
      // TODO: Añadir validaciones más detalladas aquí o, idealmente, dentro de Paso2Prendas y Paso3Personalizacion
      // Por ejemplo, verificar si campos de personalización requeridos están llenos.

      const refPedido = doc(db, 'pedidos', pedidoId);

      // 1. Actualizar el documento principal del pedido (para personalización)
      await updateDoc(refPedido, {
        personalizacion: formData.personalizacion,
        // Aquí podrías añadir otros campos de nivel superior si se editan en los pasos
      });

      // 2. Actualizar/Añadir/Eliminar items en la subcolección 'items'
      const itemsRef = collection(db, 'pedidos', pedidoId, 'items');

      // Detectar items eliminados comparando con el estado inicial
      const currentItemIds = formData.prendas.map(p => p.id);
      const deletedItemIds = initialPrendasLoaded.filter(originalItem =>
        !currentItemIds.includes(originalItem.id)
      ).map(item => item.id);

      // Eliminar documentos de items que fueron removidos
      await Promise.all(deletedItemIds.map(async (idToDelete) => {
        const itemDocRef = doc(itemsRef, idToDelete);
        await deleteDoc(itemDocRef); // Habilitado para eliminar items
      }));

      // Actualizar o añadir items existentes/nuevos
      await Promise.all(formData.prendas.map(prenda => {
        const itemDocRef = doc(itemsRef, prenda.id);
        return setDoc(itemDocRef, prenda); // Sobrescribe si existe, crea si no
      }));

      // 3. Registrar la acción en la subcolección 'historial'
      const historialRef = collection(refPedido, 'historial');
      await addDoc(historialRef, {
        fecha: Timestamp.now(),
        accion: 'Pedido editado (prendas y personalización) desde el panel de administración.',
        editedBy: user?.uid || 'admin_desconocido', // Autenticación del editor
      });

      toast.success('Pedido actualizado correctamente.');
      navigate(`/admin/dashboard/pedido/${pedidoId}`); // Redirigir al detalle del pedido

    } catch (err) {
      console.error('Error al guardar cambios del formulario:', err);
      toast.error('Error al guardar cambios del formulario.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para guardar el estado y las notas internas (del código antiguo)
  const handleGuardarAdminActions = async () => {
    try {
      setLoading(true);
      const refPedido = doc(db, 'pedidos', pedidoId);

      // Actualizar el estado del pedido
      await updateDoc(refPedido, { estado });

      // Si hay una nota interna, añadirla al historial
      if (notaInterna.trim()) {
        const historialRef = collection(refPedido, 'historial');
        await addDoc(historialRef, {
          accion: notaInterna,
          fecha: Timestamp.now(),
          editedBy: user?.uid || 'admin_desconocido', // Autenticación del editor
        });
        setNotaInterna(''); // Limpiar el campo después de guardar
      }

      toast.success('Estado y/o nota interna guardados.');
    } catch (error) {
      console.error('Error al guardar estado/nota:', error);
      toast.error('Error al guardar el estado o la nota interna.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizado del estado de carga
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center h-screen bg-gray-100"
      >
        <Loader className="mx-auto animate-spin text-blue-600 w-12 h-12" />
        <div className="text-xl font-semibold text-gray-700 mt-4">Cargando pedido...</div>
      </motion.div>
    );
  }

  // Renderizado del estado de error
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen bg-gray-100"
      >
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </motion.div>
    );
  }

  // Renderizado principal del componente
  return (
    <motion.div
      className="container max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl my-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title={`Editar Pedido #${pedidoId.slice(0, 7).toUpperCase()}`}
        description="Edición de pedidos desde el panel de administración de Fénix"
      />

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Editar Pedido <span className="text-blue-600">#{pedidoId.slice(0, 7).toUpperCase()}</span>
      </h1>

      {/* Banner de información de edición */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
        <p className="font-bold">¡Atención!</p>
        <p>Estás editando un pedido existente. Los datos del cliente no son modificables.</p>
      </div>

      {/* Sección del formulario de edición por pasos */}
      <section className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edición de Contenido (Prendas y Personalización)</h2>
        {currentStep === 2 && (
          <Paso2Prendas
            formData={formData} // Pasa el formData completo
            setFormData={setFormData} // Pasa setFormData para actualizar el estado
            errores={errores} // Pasa los errores
            setErrores={setErrores} // Pasa setErrores
            onNext={handleNextStep}
          />
        )}
        {currentStep === 3 && (
          <Paso3Personalizacion
            formData={formData} // Pasa el formData completo
            handleChange={(field, value) => handleStepInputChange('personalizacion', field, value)} // Función específica para personalización
            errores={errores} // Pasa los errores
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        )}
        {currentStep === 4 && (
          <Paso4Confirmacion
            formData={formData} // Pasa el formData completo
            setFormData={setFormData} // Pasa setFormData (necesario para la aceptación de términos)
            errores={errores} // Pasa los errores
            onConfirm={handleSubmitEditForm} // Llama a la función de guardado de formulario de pasos
            onBack={handlePreviousStep}
            modoEdicion={true} // Indicador de modo edición
          />
        )}
      </section>

      {/* Sección de acciones administrativas (Estado y Notas Internas) */}
      <section className="p-6 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Acciones Administrativas</h2>
        <div className="space-y-6 bg-white p-6 rounded shadow-md">
          <div>
            <label htmlFor="estado-select" className="font-semibold text-gray-700">Estado del Pedido</label>
            <select
              id="estado-select"
              className="block w-full p-2 border border-gray-300 mt-1 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="Nuevo">Nuevo</option>
              <option value="En producción">En producción</option>
              <option value="Listo para entregar">Listo para entregar</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label htmlFor="nota-interna-textarea" className="font-semibold text-gray-700">Añadir Nota Interna</label>
            <textarea
              id="nota-interna-textarea"
              className="block w-full p-2 border border-gray-300 mt-1 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
              rows="4"
              placeholder="Registrar un comentario o actualización (solo visible para administradores)..."
              value={notaInterna}
              onChange={(e) => setNotaInterna(e.target.value)}
            />
          </div>

          <button
            onClick={handleGuardarAdminActions} // Llama a la función de guardado de acciones administrativas
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar Estado y Nota Interna
          </button>
        </div>
      </section>
      {/* Contenedor para las notificaciones toast */}
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </motion.div>
  );
};

export default EditarPedidoDashboard;
// Este componente EditarPedidoDashboard permite editar un pedido existente en el panel de administración.
// Incluye pasos para editar prendas y personalización, así como acciones administrativas para actualizar el estado del pedido y agregar notas internas.