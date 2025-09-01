import { NavLink } from "react-router-dom";
// 1. Corregir la importación aquí: LuUsers2 -> LuUsers
import { LuLayoutDashboard, LuPackage, LuUsers, LuShoppingCart } from "react-icons/lu";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h1 className="logo">
          🍓 Fresas<span>Panel</span>
        </h1>
        
        <div className="sidebar-menu">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
                <LuLayoutDashboard className="menu-icon" />
                <span>Estadísticas</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/pedidos" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
                <LuPackage className="menu-icon" />
                <span>Pedidos</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
                {/* 2. Corregir el uso del componente aquí: LuUsers2 -> LuUsers */}
                <LuUsers className="menu-icon" />
                <span>Usuarios</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos" className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
                <LuShoppingCart className="menu-icon" />
                <span>Productos</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}