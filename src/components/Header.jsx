import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Header({ usuario, toggleSidebar }) {
  // Obtenemos la función logout del contexto global
  const { logout } = useAppContext();
  // Obtenemos la función navigate para poder redirigir al usuario
  const navigate = useNavigate();

  // Esta función se ejecuta cuando el usuario hace clic en "Cerrar Sesión"
  const handleLogout = () => {
    logout(); // Llama a la función del contexto para actualizar el estado de autenticación
    navigate('/login'); // Redirige al usuario a la página de login
  };

  return (
    <header className="header">
      {/* Botón para el menú en vista móvil */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Contenedor para alinear el saludo y el botón de logout */}
      <div className="header-content">
        <p>Bienvenido, {usuario}</p>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}