// src/components/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiFetch from '../utils/api';
import './Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); // Limpiar mensaje previo

    try {
      // Llamamos a nuestro nuevo endpoint del backend
      const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ correo: email }),
      });
      
      toast.success('¡Petición enviada!');
      setMessage(response.message); // Mostramos el mensaje del servidor

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Recuperar Contraseña</h2>
          <p>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
          
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Correo electrónico"
            />
          </div>
          
          {message && <p style={{ color: 'lightgreen', marginBottom: '15px' }}>{message}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>
          
          <div className="register-link">
            <p>¿Recordaste tu contraseña? <Link to="/login">Inicia Sesión</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}