import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx"; // NUEVO
import PedidoList from "./components/PedidoList.jsx";
import Usuarios from "./components/Usuarios.jsx";
import Productos from "./components/Productos.jsx"; // NUEVO

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header usuario="Administrador" />
        <section className="content-section">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pedidos" element={<PedidoList />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/productos" element={<Productos />} />
            <Route
              path="/configuracion"
              element={
                <>
                  <h2>Configuración</h2>
                  <p>Aquí podrás modificar ajustes del sistema.</p>
                </>
              }
            />
          </Routes>
        </section>
      </div>
    </div>
  );
}