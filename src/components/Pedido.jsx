export default function Pedido({ pedido, marcarListo, eliminarPedido }) {
    return (
      <div
        className={`pedido-card ${
          pedido.estado === "Listo para entregar" ? "listo" : ""
        }`}
      >
        <h3>
          Pedido #{pedido.id} - {pedido.usuario}
        </h3>
        <ul>
          {pedido.items.map((item, idx) => (
            <li key={idx}>
              {item.cantidad} x {item.nombre}
            </li>
          ))}
        </ul>
        <p>
          Estado:{" "}
          <span
            className={`status ${pedido.estado
              .toLowerCase()
              .replace(/\s/g, "-")}`}
          >
            {pedido.estado}
          </span>
        </p>
        {pedido.estado === "Pendiente" && (
          <button onClick={() => marcarListo(pedido.id)}>Marcar como listo</button>
        )}
        {pedido.estado === "Listo para entregar" && (
          <p className="listo-msg">¡Pedido listo para entregar! Notificar al usuario.</p>
        )}
  
        {/* Botón de eliminar */}
        <button
          className="btn-delete"
          onClick={() => eliminarPedido(pedido.id)}
        >
          🗑 Eliminar
        </button>
      </div>
    );
  }
  