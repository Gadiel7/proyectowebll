import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de login
    return <Navigate to="/login" />;
  }

  return children; // Si está autenticado, mostrar el contenido protegido
}