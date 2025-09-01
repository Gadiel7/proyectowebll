// src/components/ResetPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiFetch from '../utils/api';
import './Login.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Obtenemos el token de la URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await apiFetch(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ password }),
      });

      toast.success('¡Contraseña actualizada!');
      setMessage(response.message + ' Serás redirigido al login.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirigir al login después de 3 segundos

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
          <h2>Establecer Nueva Contraseña</h2>
          <p>Ingresa tu nueva contraseña a continuación.</p>
          
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nueva contraseña"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirmar nueva contraseña"
            />
          </div>
          
          {message && <p style={{ color: 'lightgreen', marginBottom: '15px' }}>{message}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}