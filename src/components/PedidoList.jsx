import { useAppContext } from "../context/AppContext";
import "./PedidoList.css";

export default function PedidoList() {
  const { pedidos, updateStatusPedido, deletePedido } = useAppContext();

  const handleStatusChange = (id, estadoActual) => {
    const nuevoEstado = estadoActual === "Pendiente" ? "Listo para entregar" : "Pendiente";
    updateStatusPedido(id, nuevoEstado);
  };
  
  return (
    <div className="pedido-list">
      <h2>Pedidos</h2>
      {pedidos.length === 0 ? (
        <p className="no-pedidos">No hay pedidos actualmente.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id} className={`pedido-card ${pedido.estado === "Listo para entregar" ? 'listo' : 'pendiente'}`}>
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
              <button onClick={() => handleStatusChange(pedido.id, pedido.estado)} className="btn btn-listo">
                {pedido.estado === "Pendiente" ? "✔️ Marcar como Listo" : "↩️ Marcar como Pendiente"}
              </button>
              <button onClick={() => deletePedido(pedido.id)} className="btn btn-eliminar">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}