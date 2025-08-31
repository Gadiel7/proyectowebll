// src/utils/api.js

// Leemos la variable de entorno directamente desde el objeto `import.meta.env` de Vite.
// Si no está definida, por seguridad, apuntará a una URL inválida para que el error sea obvio.
const API_URL = import.meta.env.VITE_API_URL || 'http://api-url-no-configurada.error';

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  // Comprobamos si la URL base fue configurada correctamente
  if (API_URL === 'http://api-url-no-configurada.error') {
    console.error("¡ERROR FATAL: La variable de entorno VITE_API_URL no está configurada en Vercel!");
    throw new Error("La URL de la API no está configurada.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.reload(); 
    throw new Error('Sesión inválida o expirada.');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ocurrió un error en la petición');
  }
  
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default apiFetch;