import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import apiFetch from '../utils/api';

const AppContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);

  // Función de ayuda para recargar los datos del dashboard
  const fetchDashboardData = async () => {
    try {
      const data = await apiFetch('/stats/summary');
      setDashboardData(data);
    } catch (error) {
      console.error("Error recargando los datos del dashboard:", error);
    }
  };

  // Función de ayuda para recargar la lista de pedidos
  const fetchPedidos = async () => {
    try {
      const pedidosData = await apiFetch('/pedidos');
      setPedidos(pedidosData);
    } catch (error) {
      toast.error("No se pudo actualizar la lista de pedidos.");
    }
  };

  // Efecto para conectar y desconectar el socket
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(API_BASE_URL);
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isAuthenticated]);

  // Efecto para unirse a salas y escuchar eventos
  useEffect(() => {
    if (socket && user) {
      if (user.rol === 'Administrador') {
        socket.emit('join_room', 'admins');
        socket.on('nuevo_pedido', (nuevoPedido) => {
          toast.success(`¡Nuevo pedido de ${nuevoPedido.nombreUsuario}!`);
          // Recargamos la lista completa para asegurar la sincronización
          fetchPedidos(); 
          fetchDashboardData();
        });
      }
      return () => {
        socket.off('nuevo_pedido');
      };
    }
  }, [socket, user]);

  // Efecto para verificar el token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          setIsAuthenticated(true);
          setUser(decodedToken.user);
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setIsInitialLoading(false);
  }, []);

  // Efecto para cargar todos los datos iniciales
  useEffect(() => {
    if (isAuthenticated && user?.rol === 'Administrador') {
      const fetchAllData = async () => {
        setIsInitialLoading(true);
        try {
          // Usamos las funciones de ayuda que ya creamos
          await fetchDashboardData();
          await fetchPedidos();
          // Cargamos el resto de los datos
          const [usuariosData, productosData] = await Promise.all([
            apiFetch('/usuarios'),
            apiFetch('/productos'),
          ]);
          setUsuarios(usuariosData);
          setProductos(productosData);
        } catch (error) {
          toast.error("No se pudieron cargar los datos del panel.");
        } finally {
          setIsInitialLoading(false);
        }
      };
      fetchAllData();
    }
  }, [isAuthenticated, user]);
  
  const login = async (correo, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ correo, password }),
      });
      localStorage.setItem('token', data.token);
      const decodedToken = jwtDecode(data.token);
      setIsAuthenticated(true);
      setUser(decodedToken.user);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setDashboardData(null);
    setPedidos([]);
    setUsuarios([]);
    setProductos([]);
  };

  const updateStatusPedido = async (id, nuevoEstado) => {
    setIsSubmitting(true);
    try {
      const pedidoActualizado = await apiFetch(`/pedidos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      setPedidos(prev => prev.map(p => (p._id === id ? pedidoActualizado : p)));
      toast.success('¡Estado del pedido actualizado!');
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePedido = async (id) => {
    setIsSubmitting(true);
    try {
      await apiFetch(`/pedidos/${id}`, { method: 'DELETE' });
      setPedidos(prev => prev.filter(p => p._id !== id));
      toast.success('¡Pedido eliminado correctamente!');
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createPedido = async (pedidoData) => {
    setIsSubmitting(true);
    try {
      await apiFetch('/pedidos', {
        method: 'POST',
        body: JSON.stringify(pedidoData),
      });
      toast.success('¡Tu pedido ha sido enviado! Recibirás una notificación cuando esté listo.');
      if (user?.rol === 'Administrador') {
        await fetchPedidos(); // Recargar pedidos si el admin crea uno
      }
      return true;
    } catch (error) {
      toast.error(error.message || 'No se pudo enviar tu pedido.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveUsuario = async (usuario) => {
    setIsSubmitting(true);
    try {
      let savedUsuario;
      if (usuario._id) {
        savedUsuario = await apiFetch(`/usuarios/${usuario._id}`, {
          method: 'PUT',
          body: JSON.stringify(usuario),
        });
        setUsuarios(prev => prev.map(u => u._id === usuario._id ? savedUsuario : u));
        toast.success('¡Usuario actualizado!');
      } else {
        savedUsuario = await apiFetch('/usuarios', {
          method: 'POST',
          body: JSON.stringify(usuario),
        });
        setUsuarios(prev => [...prev, savedUsuario]);
        toast.success('¡Usuario creado!');
      }
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUsuario = async (id) => {
    setIsSubmitting(true);
    try {
      await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios(prev => prev.filter(u => u._id !== id));
      toast.success('¡Usuario eliminado!');
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveProducto = async (producto) => {
    setIsSubmitting(true);
    try {
      let savedProducto;
      if (producto._id) {
        savedProducto = await apiFetch(`/productos/${producto._id}`, {
          method: 'PUT',
          body: JSON.stringify(producto),
        });
        setProductos(prev => prev.map(p => p._id === producto._id ? savedProducto : p));
        toast.success('¡Producto actualizado!');
      } else {
        savedProducto = await apiFetch('/productos', {
          method: 'POST',
          body: JSON.stringify(producto),
        });
        setProductos(prev => [...prev, savedProducto]);
        toast.success('¡Producto creado!');
      }
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProducto = async (id) => {
    setIsSubmitting(true);
    try {
      await apiFetch(`/productos/${id}`, { method: 'DELETE' });
      setProductos(prev => prev.filter(p => p._id !== id));
      toast.success('¡Producto eliminado!');
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    dashboardData,
    pedidos,
    updateStatusPedido,
    deletePedido,
    createPedido,
    usuarios,
    saveUsuario,
    deleteUsuario,
    productos,
    saveProducto,
    deleteProducto,
    isInitialLoading,
    isSubmitting,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}