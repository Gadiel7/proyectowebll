import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import confirmAlert from "../utils/confirmAlert";
import "./Usuarios.css";

const initialFormState = { nombre: "", correo: "", rol: "Cliente" };

export default function Usuarios() {
  const { usuarios, saveUsuario, deleteUsuario, isSubmitting } = useAppContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialFormState);

  const handleEdit = (usuario) => {
    setCurrentUser(usuario);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setCurrentUser(initialFormState);
    setIsFormVisible(true);
  };

  const handleDelete = async (id, nombre) => {
    const result = await confirmAlert(
      '¿Estás seguro?', 
      `¡No podrás revertir la eliminación de ${nombre}!`
    );

    if (result.isConfirmed) {
      deleteUsuario(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveUsuario(currentUser).then(() => {
        setIsFormVisible(false);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="usuarios-container">
      <h2>Gestión de Usuarios</h2>
      <button className="btn btn-agregar" onClick={handleAddNew} disabled={isSubmitting}>
        ➕ Agregar Usuario
      </button>

      {isFormVisible && (
        <div className="form-modal">
          <form onSubmit={handleSave} className="usuario-form">
            <h3>{currentUser._id ? "Editar Usuario" : "Nuevo Usuario"}</h3>
            <input type="text" name="nombre" value={currentUser.nombre} onChange={handleChange} placeholder="Nombre completo" required />
            <input type="email" name="correo" value={currentUser.correo} onChange={handleChange} placeholder="Correo electrónico" required />
            <select name="rol" value={currentUser.rol} onChange={handleChange}>
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
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

      <table className="usuarios-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td data-label="Nombre">{usuario.nombre}</td>
              <td data-label="Correo">{usuario.correo}</td>
              <td data-label="Rol">{usuario.rol}</td>
              <td data-label="Acciones">
                <button className="btn editar" onClick={() => handleEdit(usuario)} disabled={isSubmitting}>✏️ Editar</button>
                <button className="btn eliminar" onClick={() => handleDelete(usuario._id, usuario.nombre)} disabled={isSubmitting}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}