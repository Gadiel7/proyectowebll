import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  // Obtenemos ambos estados del contexto
  const { isAuthenticated, isInitialLoading } = useAppContext();

  // 1. Si estamos en el proceso de carga inicial...
  if (isInitialLoading) {
    // ...no renderizamos nada o, mejor aún, un spinner de carga.
    // Esto previene la redirección prematura.
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Una vez que la carga inicial ha terminado, verificamos la autenticación.
  if (!isAuthenticated) {
    // Si no está autenticado, AHORA SÍ lo redirigimos al login.
    return <Navigate to="/login" />;
  }

  // 3. Si todo está bien, mostramos el contenido protegido.
  return children;
}