import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx"; // <-- IMPORTAR
import ResetPassword from "./components/ResetPassword.jsx";   // <-- IMPORTAR
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PanelLayout from "./components/PanelLayout.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PedidoList from "./components/PedidoList.jsx";
import Usuarios from "./components/Usuarios.jsx";
import Productos from "./components/Productos.jsx";
import ClienteDashboard from "./components/ClienteDashboard.jsx";
import { useAppContext } from "./context/AppContext.jsx";

function AppRoutes() {
  const { user } = useAppContext();

  if (user?.rol === 'Administrador') {
    return (
      <Routes>
        <Route path="/" element={<PanelLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pedidos" element={<PedidoList />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="productos" element={<Productos />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    );
  }

  if (user?.rol === 'Cliente') {
    return (
      <Routes>
        <Route path="/" element={<ClienteDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Si no hay usuario, puede acceder a las rutas públicas
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* <-- AÑADIR */}
      <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* <-- AÑADIR */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  const { isInitialLoading } = useAppContext();

  if (isInitialLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return <AppRoutes />;
}