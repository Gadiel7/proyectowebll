import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h1 className="logo">FresasConCrema</h1>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/pedidos" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
              📦 Pedidos
            </NavLink>
          </li>
          <li>
            <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
              👥 Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
              🍓 Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/configuracion" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
              ⚙️ Configuración
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}