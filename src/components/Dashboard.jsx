import { useAppContext } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import "./Dashboard.css";

export default function Dashboard() {
  const { dashboardData, isInitialLoading } = useAppContext();

  if (isInitialLoading || !dashboardData) {
    return (
      <div className="dashboard-container">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <h2>Resumen de Estadísticas</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pedidos Pendientes</h3>
          <p>{dashboardData.pedidosPendientes}</p>
        </div>
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <p>{dashboardData.totalPedidos}</p>
        </div>
        <div className="stat-card">
          <h3>Clientes Registrados</h3>
          <p>{dashboardData.totalUsuarios}</p>
        </div>
        <div className="stat-card">
          <h3>Productos Activos</h3>
          <p>{dashboardData.totalProductos}</p>
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="chart-container">
          <h3>Top 5 Productos Más Pedidos</h3>
          {dashboardData.topProductos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.topProductos} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip cursor={{fill: '#f5f5f5'}} formatter={(value) => `${value} unidades`} />
                <Legend />
                <Bar dataKey="total" name="Unidades Vendidas" fill="#3b82f6" /> {/* <-- COLOR ACTUALIZADO */}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay suficientes datos de pedidos para mostrar el gráfico.</p>
          )}
        </div>

        <div className="recent-orders-container">
          <h3>Pedidos Recientes</h3>
          {dashboardData.pedidosRecientes.length > 0 ? (
            <ul className="recent-orders-list">
              {dashboardData.pedidosRecientes.map(pedido => (
                <li key={pedido._id}>
                  <span>{pedido.usuario}</span>
                  <span className={`estado ${pedido.estado.toLowerCase().replace(/\s/g, '-')}`}>{pedido.estado}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay pedidos recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
}