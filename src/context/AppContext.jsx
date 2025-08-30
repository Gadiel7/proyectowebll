import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

// URL base de nuestro backend
const API_URL = 'http://localhost:5000/api';

export function AppProvider({ children }) {
  // --- ESTADO DE AUTENTICACIÓN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // --- ESTADOS DE DATOS --- (Ahora inician vacíos)
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  // Los productos los dejamos como datos estáticos por ahora
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Fresas con crema", precio: 5.00, stock: 50, categoria: "Postres" },
    { id: 2, nombre: "Fresas naturales", precio: 3.50, stock: 100, categoria: "Frutas" },
    { id: 3, nombre: "Malteada de Fresa", precio: 4.50, stock: 30, categoria: "Bebidas" },
  ]);

  // --- EFECTO PARA CARGAR DATOS INICIALES ---
  useEffect(() => {
    // Si el usuario está autenticado, cargamos los datos desde la API
    if (isAuthenticated) {
      const fetchAllData = async () => {
        try {
          // Usamos Promise.all para hacer las peticiones en paralelo
          const [pedidosResponse, usuariosResponse] = await Promise.all([
            fetch(`${API_URL}/pedidos`),
            fetch(`${API_URL}/usuarios`),
          ]);

          const pedidosData = await pedidosResponse.json();
          const usuariosData = await usuariosResponse.json();

          setPedidos(pedidosData);
          setUsuarios(usuariosData);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      };
      fetchAllData();
    }
  }, [isAuthenticated]); // Este efecto se ejecuta cada vez que el estado de autenticación cambia

  // --- LÓGICA DE AUTENTICACIÓN (Sin cambios) ---
  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setUser({ name: 'Administrador' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPedidos([]); // Limpiamos los datos al cerrar sesión
    setUsuarios([]);
  };

  // --- LÓGICA DE PEDIDOS (Ahora llama a la API) ---
  const updateStatusPedido = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      const pedidoActualizado = await response.json();
      setPedidos(prev => prev.map(p => (p._id === id ? pedidoActualizado : p)));
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }
  };

  const deletePedido = async (id) => {
    try {
      await fetch(`${API_URL}/pedidos/${id}`, { method: 'DELETE' });
      setPedidos(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  // --- LÓGICA DE USUARIOS (Ahora llama a la API) ---
  const saveUsuario = async (usuario) => {
    try {
      // Si no hay id, es un usuario nuevo (POST)
      if (!usuario._id) {
        const response = await fetch(`${API_URL}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario),
        });
        const nuevoUsuario = await response.json();
        setUsuarios(prev => [...prev, nuevoUsuario]);
      } 
      // Si hay un id, actualizaremos (esto es para el futuro, la API aún no lo tiene)
      else {
        // Lógica de actualización (PUT) iría aquí
        console.log("Actualizando usuario (lógica futura):", usuario);
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const deleteUsuario = async (id) => {
    // La API para eliminar un usuario específico aún no está creada,
    // pero dejamos la lógica lista
    console.log("Eliminando usuario (lógica futura):", id);
  };
  
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    pedidos,
    usuarios,
    productos,
    updateStatusPedido,
    deletePedido,
    saveUsuario,
    deleteUsuario,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}