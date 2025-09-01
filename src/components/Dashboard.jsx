import { useAppContext } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import "./Dashboard.css";

// Ya no necesitamos la variable de ejemplo 'salesData', la hemos eliminado.

export default function Dashboard() {
  const { dashboardData, isInitialLoading } = useAppContext();

  if (isInitialLoading || !dashboardData) {
    return (
      <div className="dashboard-container">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }
  
  // (La función formatCurrency no cambia)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value || 0);
  };

  return (
    <div className="dashboard-container">
      <h2>Resumen de Estadísticas</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pedidos Pendientes</h3>
          <p>{dashboardData.pedidosPendientes || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <p>{dashboardData.totalPedidos || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Clientes Registrados</h3>
          <p>{dashboardData.totalUsuarios || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Productos Activos</h3>
          <p>{dashboardData.totalProductos || 0}</p>
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="chart-container">
          <h3>Top 5 Productos Más Pedidos</h3>
          {/* Verificamos que existan datos antes de intentar renderizar el gráfico */}
          {dashboardData.topProductos && dashboardData.topProductos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              {/* --- CAMBIO IMPORTANTE AQUÍ --- */}
              {/* Ahora el 'data' del gráfico viene de nuestro estado `dashboardData` */}
              <BarChart data={dashboardData.topProductos} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip cursor={{fill: '#f5f5f5'}} formatter={(value) => `${value} unidades`} />
                <Legend />
                <Bar dataKey="total" name="Unidades Vendidas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay suficientes datos de pedidos para mostrar el gráfico.</p>
          )}
        </div>

        <div className="recent-orders-container">
          <h3>Pedidos Recientes</h3>
          {dashboardData.pedidosRecientes && dashboardData.pedidosRecientes.length > 0 ? (
            <ul className="recent-orders-list">
              {dashboardData.pedidosRecientes.map(pedido => (
                <li key={pedido._id}>
                  <span>{pedido.nombreUsuario || 'Usuario Desconocido'}</span>
                  <span className={`estado ${pedido.estado?.toLowerCase().replace(/\s/g, '-') || 'pendiente'}`}>
                    {pedido.estado || 'Pendiente'}
                  </span>
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