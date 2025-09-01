import { useAppContext } from "../context/AppContext";
import "./PedidoList.css";

export default function PedidoList() {
  const { pedidos, updateStatusPedido, deletePedido, isSubmitting } = useAppContext();

  const handleStatusChange = (id, estadoActual) => {
    const nuevoEstado = estadoActual === "Pendiente" ? "Listo para entregar" : "Pendiente";
    updateStatusPedido(id, nuevoEstado);
  };
  
  return (
    <div className="pedido-list-container">
      <h2>Pedidos</h2>
      <div className="pedido-list">
        {pedidos.length === 0 && !isSubmitting ? (
          <p className="no-pedidos">No hay pedidos actualmente.</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido._id} className={`pedido-card ${pedido.estado === "Listo para entregar" ? 'listo' : 'pendiente'}`}>
              <div className="pedido-header">
                <h3>{pedido.usuario}</h3>
                <span className={`estado ${pedido.estado === "Listo para entregar" ? "listo" : "pendiente"}`}>
                  {pedido.estado}
                </span>
              </div>
              <ul className="pedido-items">
                {pedido.items.map((item, index) => (
                  <li key={index}>
                    🍓 {item.cantidad} × {item.nombre}
                  </li>
                ))}
              </ul>
              <div className="pedido-actions">
                <button onClick={() => handleStatusChange(pedido._id, pedido.estado)} className="btn btn-listo" disabled={isSubmitting}>
                  {pedido.estado === "Pendiente" ? "✔️ Marcar como Listo" : "↩️ Marcar como Pendiente"}
                </button>
                <button onClick={() => deletePedido(pedido._id)} className="btn btn-eliminar" disabled={isSubmitting}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}