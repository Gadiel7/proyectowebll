import { useAppContext } from "../context/AppContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { pedidos, usuarios, productos } = useAppContext();

  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <p>{pedidos.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pedidos Pendientes</h3>
          <p>{pedidosPendientes}</p>
        </div>
        <div className="stat-card">
          <h3>Usuarios Registrados</h3>
          <p>{usuarios.length}</p>
        </div>
        <div className="stat-card">
          <h3>Productos Activos</h3>
          <p>{productos.length}</p>
        </div>
      </div>
      {/* Aquí podrías agregar gráficos en el futuro */}
    </div>
  );
}