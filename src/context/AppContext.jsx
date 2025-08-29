import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

const initialData = {
  pedidos: [
    { id: 1, usuario: "Juan Pérez", items: [{ nombre: "Fresas con crema", cantidad: 2 }, { nombre: "Fresas naturales", cantidad: 1 }], estado: "Pendiente", fecha: "2025-08-28T10:30:00Z" },
    { id: 2, usuario: "María López", items: [{ nombre: "Fresas con crema", cantidad: 3 }], estado: "Listo para entregar", fecha: "2025-08-28T09:15:00Z" },
  ],
  usuarios: [
    { id: 1, nombre: "Juan Pérez", correo: "juanperez@mail.com", rol: "Cliente" },
    { id: 2, nombre: "María López", correo: "maria.lopez@mail.com", rol: "Cliente" },
    { id: 3, nombre: "Carlos Díaz", correo: "carlos.diaz@mail.com", rol: "Administrador" },
  ],
  productos: [
    { id: 1, nombre: "Fresas con crema", precio: 5.00, stock: 50, categoria: "Postres" },
    { id: 2, nombre: "Fresas naturales", precio: 3.50, stock: 100, categoria: "Frutas" },
    { id: 3, nombre: "Malteada de Fresa", precio: 4.50, stock: 30, categoria: "Bebidas" },
  ]
};

export function AppProvider({ children }) {
  const [pedidos, setPedidos] = useState(initialData.pedidos);
  const [usuarios, setUsuarios] = useState(initialData.usuarios);
  const [productos, setProductos] = useState(initialData.productos);

  // --- Lógica de Pedidos ---
  const updateStatusPedido = (id, nuevoEstado) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };
  const deletePedido = (id) => {
    setPedidos(prev => prev.filter(p => p.id !== id));
  };

  // --- Lógica de Usuarios ---
  const saveUsuario = (usuario) => {
    if (usuario.id) { // Editar
      setUsuarios(prev => prev.map(u => u.id === usuario.id ? usuario : u));
    } else { // Crear
      const nuevoId = Math.max(...usuarios.map(u => u.id)) + 1;
      setUsuarios(prev => [...prev, { ...usuario, id: nuevoId }]);
    }
  };
  const deleteUsuario = (id) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  // --- Lógica de Productos ---
  // (Aquí irían funciones para guardar y eliminar productos, te las dejo como ejercicio o para un paso futuro)


  const value = {
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