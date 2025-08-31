import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast'; // Importar toast para mostrar errores
import "./Login.css";

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // --- CÓDIGO DE PRUEBA DE CONEXIÓN DIRECTA ---
      const response = await fetch('https://fresas-api-panel.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el servidor responde con un error (ej. credenciales incorrectas), lo lanzamos
        throw new Error(data.message || 'Error en la respuesta del servidor');
      }
      // --- FIN DEL CÓDIGO DE PRUEBA ---
      
      // Si el fetch directo fue exitoso, significa que la conexión funciona.
      // Ahora llamamos a la función de login del contexto para que guarde el token.
      const success = await login(correo, password);
      
      if (success) {
        navigate('/');
      } else {
        // Esto podría ocurrir si hay una discrepancia entre el fetch directo y la lógica del contexto
        setError('Ocurrió un error al procesar el inicio de sesión.');
      }

    } catch (error) {
      // Este bloque se activará si el fetch falla (ej. ERR_CONNECTION_REFUSED)
      // o si la respuesta del servidor no fue exitosa.
      console.error("Error directo de fetch en Login.jsx:", error);
      setError(error.message || 'No se pudo conectar con el servidor.');
      toast.error(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Panel de Administración</h2>
          <p>Fresas con Crema</p>
          <div className="input-group">
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="Correo electrónico"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
            />
          </div>
          {error && !isLoading && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
          
          <div className="register-link">
            <p>¿Eres cliente y no tienes cuenta? <Link to="/register">Regístrate</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}