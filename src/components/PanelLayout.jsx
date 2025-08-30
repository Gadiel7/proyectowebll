import { useState, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom"; // Outlet es donde se renderizan las rutas anidadas
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { useAppContext } from "../context/AppContext.jsx";

export default function PanelLayout() {
  const { user } = useAppContext();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useLayoutEffect(() => {
    if (isSidebarOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Header usuario={user?.name || 'Admin'} toggleSidebar={toggleSidebar} />
        <section className="content-section">
          <Outlet /> {/* Aquí se renderizará Dashboard, Usuarios, etc. */}
        </section>
      </div>
    </div>
  );
}