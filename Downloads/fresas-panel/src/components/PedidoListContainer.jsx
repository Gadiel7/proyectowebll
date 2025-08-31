import { useState } from "react";
import PedidoList from "./PedidoList.jsx"; // y PedidoList.css se importa desde ahí


export default function PedidoListContainer({ initialPedidos }) {
  const [pedidos, setPedidos] = useState(initialPedidos);

  function marcarListo(id) {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: "Listo para entregar" } : p
      )
    );
  }

  function eliminarPedido(id) {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <PedidoList
      pedidos={pedidos}
      marcarListo={marcarListo}
      eliminarPedido={eliminarPedido}
    />
  );
}
