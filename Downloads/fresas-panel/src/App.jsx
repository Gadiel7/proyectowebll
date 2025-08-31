// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx"; // <-- IMPORTAR
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PanelLayout from "./components/PanelLayout.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PedidoList from "./components/PedidoList.jsx";
import Usuarios from "./components/Usuarios.jsx";
import Productos from "./components/Productos.jsx";
import ClienteDashboard from "./components/ClienteDashboard.jsx"; // <-- IMPORTAR
import { useAppContext } from "./context/AppContext.jsx";

function AppRoutes() {
  const { user } = useAppContext();

  // Si el usuario es un administrador, le mostramos las rutas del panel
  if (user?.rol === 'Administrador') {
    return (
      <Routes>
        <Route path="/" element={<PanelLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pedidos" element={<PedidoList />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="productos" element={<Productos />} />
          <Route path="configuracion" element={<p>Configuración</p>} />
          {/* Cualquier otra ruta redirige al dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    );
  }

  // Si el usuario es un cliente, le mostramos su dashboard
  if (user?.rol === 'Cliente') {
    return (
      <Routes>
        <Route path="/" element={<ClienteDashboard />} />
        {/* Cualquier otra ruta redirige a su dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Si no hay usuario, solo puede acceder a login y register
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Cualquier otra ruta lo redirige al login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}


export default function App() {
  const { isInitialLoading } = useAppContext();

  // Muestra un loader global mientras se verifica la sesión
  if (isInitialLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return <AppRoutes />;
}