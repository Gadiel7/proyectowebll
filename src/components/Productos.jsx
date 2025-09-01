import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import confirmAlert from "../utils/confirmAlert";
import "./Productos.css";

const initialFormState = { nombre: "", precio: "", stock: "", categoria: "" };

export default function Productos() {
  const { productos, saveProducto, deleteProducto, isSubmitting } = useAppContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(initialFormState);

  const handleEdit = (producto) => {
    setCurrentProduct(producto);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(initialFormState);
    setIsFormVisible(true);
  };

  const handleDelete = async (id, nombre) => {
    const result = await confirmAlert(
      '¿Estás seguro?',
      `Esta acción eliminará el producto "${nombre}" permanentemente.`
    );

    if (result.isConfirmed) {
      deleteProducto(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const productToSave = {
        ...currentProduct,
        precio: parseFloat(currentProduct.precio),
        stock: parseInt(currentProduct.stock, 10),
    };
    saveProducto(productToSave).then(() => {
        setIsFormVisible(false);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="productos-container">
      <h2>Gestión de Productos</h2>
      <button className="btn btn-agregar" onClick={handleAddNew} disabled={isSubmitting}>
        ➕ Agregar Producto
      </button>

      {isFormVisible && (
        <div className="form-modal">
          <form onSubmit={handleSave} className="usuario-form">
            <h3>{currentProduct._id ? "Editar Producto" : "Nuevo Producto"}</h3>
            <input type="text" name="nombre" value={currentProduct.nombre} onChange={handleChange} placeholder="Nombre del producto" required />
            <input type="number" name="precio" value={currentProduct.precio} onChange={handleChange} placeholder="Precio (ej. 5.00)" step="0.01" required />
            <input type="number" name="stock" value={currentProduct.stock} onChange={handleChange} placeholder="Stock disponible" required />
            <input type="text" name="categoria" value={currentProduct.categoria} onChange={handleChange} placeholder="Categoría (ej. Postres)" required />
            <div className="form-actions">
              <button type="submit" className="btn editar" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" className="btn eliminar" onClick={() => setIsFormVisible(false)} disabled={isSubmitting}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
            <tr key={producto._id}>
              <td data-label="Nombre">{producto.nombre}</td>
              <td data-label="Precio">${producto.precio.toFixed(2)}</td>
              <td data-label="Stock">{producto.stock}</td>
              <td data-label="Categoría">{producto.categoria}</td>
              <td data-label="Acciones">
                <button className="btn editar" onClick={() => handleEdit(producto)} disabled={isSubmitting}>✏️ Editar</button>
                <button className="btn eliminar" onClick={() => handleDelete(producto._id, producto.nombre)} disabled={isSubmitting}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}