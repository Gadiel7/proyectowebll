import { useState, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import "./Loader.css";

export default function PanelLayout() {
  const { user, isInitialLoading } = useAppContext();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- LÍNEA DE DEPURACIÓN AÑADIDA ---
  // Esto se mostrará en la consola del navegador cuando entres al panel.
  console.log("Datos del usuario en PanelLayout:", user);

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
        <Header usuario={user?.nombre || 'Admin'} toggleSidebar={toggleSidebar} />
        <section className="content-section">
          {isInitialLoading ? (
            <div className="loader-container">
              <p>Cargando datos...</p>
            </div>
          ) : (
            <Outlet />
          )}
        </section>
      </div>
    </div>
  );
}