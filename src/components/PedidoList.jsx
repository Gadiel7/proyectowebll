import { useAppContext } from "../context/AppContext";
import confirmAlert from "../utils/confirmAlert";
import "./PedidoList.css";

export default function PedidoList() {
  const { pedidos, updateStatusPedido, deletePedido, isSubmitting } = useAppContext();

  const handleStatusChange = (id, estadoActual) => {
    // Solo actualizamos si el estado actual es "Pendiente"
    if (estadoActual === "Pendiente") {
      updateStatusPedido(id, "Listo para entregar");
    }
  };

  const handleDelete = async (id, nombreUsuario) => {
    const result = await confirmAlert(
      '¿Eliminar Pedido?',
      `Esta acción eliminará el pedido de ${nombreUsuario} permanentemente.`
    );
    if (result.isConfirmed) {
      deletePedido(id);
    }
  };
  
  return (
    <div className="pedido-list-container">
      <h2>Gestión de Pedidos</h2>
      <div className="pedido-list">
        {pedidos.length === 0 && !isSubmitting ? (
          <p className="no-pedidos">No hay pedidos actualmente.</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido._id} className={`pedido-card ${pedido.estado?.toLowerCase().replace(/\s/g, '-') || 'pendiente'}`}>
              <div className="pedido-header">
                <h3>{pedido.nombreUsuario || 'Usuario Desconocido'}</h3>
                <span className={`estado ${pedido.estado?.toLowerCase().replace(/\s/g, '-') || 'pendiente'}`}>
                  {pedido.estado || 'Pendiente'}
                </span>
              </div>
              <ul className="pedido-items">
                  <li><strong>Tamaño:</strong> {pedido.tamano || 'No especificado'}</li>
                  <li><strong>Crema:</strong> {pedido.crema || 'No especificado'}</li>
                  {pedido.frutas && pedido.frutas.length > 0 && (
                      <li><strong>Frutas:</strong> {pedido.frutas.join(', ')}</li>
                  )}
                  {pedido.toppings && pedido.toppings.length > 0 && (
                      <li><strong>Toppings:</strong> {pedido.toppings.join(', ')}</li>
                  )}
                  <li className="precio-total">
                    <strong>Total:</strong> Bs {(pedido.precioTotal || 0).toFixed(2)}
                  </li>
              </ul>
              <div className="pedido-actions">
                <button 
                  onClick={() => handleStatusChange(pedido._id, pedido.estado)} 
                  className="btn btn-listo" 
                  disabled={isSubmitting || pedido.estado !== 'Pendiente'}
                >
                  ✔️ Marcar como Listo
                </button>
                <button onClick={() => handleDelete(pedido._id, pedido.nombreUsuario)} className="btn btn-eliminar" disabled={isSubmitting}>
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