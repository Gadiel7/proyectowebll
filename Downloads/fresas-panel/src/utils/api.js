// src/utils/api.js
const API_URL = 'http://localhost:5000/api';

/**
 * Función fetch personalizada que automáticamente añade el token de autenticación
 * a las cabeceras de cada petición a la API.
 * @param {string} endpoint - La ruta de la API a la que llamar (ej. '/pedidos').
 * @param {object} options - Las opciones de configuración de fetch (method, body, etc.).
 * @returns {Promise<any>} - La respuesta de la API en formato JSON.
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si el token es inválido o expiró, el servidor devolverá 401
  if (response.status === 401) {
    // Limpiamos el token inválido y recargamos la página para redirigir al login
    localStorage.removeItem('token');
    window.location.reload(); 
    throw new Error('Sesión inválida o expirada. Por favor, inicie sesión de nuevo.');
  }

  // Si la respuesta no fue 'ok' (ej. error 400, 500), lanzamos un error
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ocurrió un error en la petición');
  }
  
  // Para peticiones DELETE que a veces no devuelven contenido
  if (response.status === 204) {
    return null;
  }

  // Si todo fue bien, devolvemos la respuesta en formato JSON
  return response.json();
};

export default apiFetch;