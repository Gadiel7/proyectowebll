// src/components/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Login.css'; // Reutilizaremos los estilos del Login

const API_URL = 'http://localhost:5000/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, rol: 'Cliente' }), // Siempre se registran como 'Cliente'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');

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
          <h2>Crear una Cuenta</h2>
          <p>Regístrate para hacer tus pedidos</p>
          
          <div className="input-group">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Nombre completo"
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="Correo electrónico"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Contraseña"
              minLength="6"
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
          
          <div className="register-link">
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
          </div>

        </form>
      </div>
    </div>
  );
}