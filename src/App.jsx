import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PanelLayout from "./components/PanelLayout.jsx"; // Importamos el nuevo Layout
import Dashboard from "./components/Dashboard.jsx";
import PedidoList from "./components/PedidoList.jsx";
import Usuarios from "./components/Usuarios.jsx";
import Productos from "./components/Productos.jsx";

export default function App() {
  return (
    <Routes>
      {/* Ruta pública para el login */}
      <Route path="/login" element={<Login />} />

      {/* Ruta protegida para el panel */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <PanelLayout />
          </ProtectedRoute>
        } 
      >
        {/* Rutas anidadas que se mostrarán dentro de PanelLayout */}
        <Route index element={<Dashboard />} />
        <Route path="pedidos" element={<PedidoList />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="productos" element={<Productos />} />
        <Route
          path="configuracion"
          element={
            <>
              <h2>Configuración</h2>
              <p>Aquí podrás modificar ajustes del sistema.</p>
            </>
          }
        />
      </Route>
    </Routes>
  );
}