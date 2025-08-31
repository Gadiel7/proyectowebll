import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- AÑADIR Link
import { useAppContext } from '../context/AppContext';
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
    const success = await login(correo, password);
    setIsLoading(false);
    if (!success) {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    }
    // La redirección ahora se maneja en el AppContext
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
          
          {/* --- AÑADIR ESTE DIV --- */}
          <div className="register-link">
            <p>¿Eres cliente y no tienes cuenta? <Link to="/register">Regístrate</Link></p>
          </div>

        </form>
      </div>
    </div>
  );
}