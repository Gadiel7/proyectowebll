import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <h1 className="logo">FresasConCrema</h1>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/pedidos" className={({ isActive }) => (isActive ? "active" : "")}>
            📦 Pedidos
          </NavLink>
        </li>
        <li>
          <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : "")}>
            👥 Usuarios
          </NavLink>
        </li>
        <li>
          <NavLink to="/productos" className={({ isActive }) => (isActive ? "active" : "")}>
            🍓 Productos
          </NavLink>
        </li>
        <li>
          <NavLink to="/configuracion" className={({ isActive }) => (isActive ? "active" : "")}>
            ⚙️ Configuración
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}