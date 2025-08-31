import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import "./styles.css";

// 1. Importar Toaster de react-hot-toast
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        {/* 2. Añadir el componente Toaster aquí. Se recomienda ponerlo antes de App */}
        <Toaster
          position="top-right" // Posición de las notificaciones
          toastOptions={{
            // Estilos por defecto para los toasts
            success: {
              style: {
                background: '#28a745',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#f44336',
                color: 'white',
              },
            },
          }}
        />
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);