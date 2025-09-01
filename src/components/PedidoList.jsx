import { useAppContext } from "../context/AppContext";
import "./PedidoList.css";

export default function PedidoList() {
  const { pedidos, updateStatusPedido, deletePedido, isSubmitting } = useAppContext();

  const handleStatusChange = (id, estadoActual) => {
    const nuevoEstado = estadoActual === "Pendiente" ? "Listo para entregar" : "Listo para entregar";
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
            <div key={pedido._id} className={`pedido-card ${pedido.estado.toLowerCase().replace(/\s/g, '-')}`}>
              <div className="pedido-header">
                <h3>{pedido.nombreUsuario}</h3>
                <span className={`estado ${pedido.estado.toLowerCase().replace(/\s/g, '-')}`}>
                  {pedido.estado}
                </span>
              </div>
              <ul className="pedido-items">
                  <li><strong>Tamaño:</strong> {pedido.tamano}</li>
                  <li><strong>Crema:</strong> {pedido.crema}</li>
                  {pedido.frutas.length > 0 && (
                      <li><strong>Frutas:</strong> {pedido.frutas.join(', ')}</li>
                  )}
                  {pedido.toppings.length > 0 && (
                      <li><strong>Toppings:</strong> {pedido.toppings.join(', ')}</li>
                  )}
                  <li className="precio-total"><strong>Total:</strong> Bs {pedido.precioTotal.toFixed(2)}</li>
              </ul>
              <div className="pedido-actions">
                <button onClick={() => handleStatusChange(pedido._id, pedido.estado)} className="btn btn-listo" disabled={isSubmitting}>
                  ✔️ Marcar como Listo
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