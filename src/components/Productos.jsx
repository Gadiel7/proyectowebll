import { useAppContext } from "../context/AppContext";
import "./Productos.css";

export default function Productos() {
  const { productos } = useAppContext();
  // Las funciones de editar/eliminar productos no están implementadas en el context,
  // pero la estructura está lista para cuando las agregues.
  
  return (
    <div className="productos-container">
      <h2>Gestión de Productos</h2>
      <button className="btn btn-agregar">➕ Agregar Producto</button>
      <table className="productos-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>${producto.precio.toFixed(2)}</td>
              <td>{producto.stock}</td>
              <td>{producto.categoria}</td>
              <td>
                <button className="btn editar">✏️ Editar</button>
                <button className="btn eliminar">🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}