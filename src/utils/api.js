// Leemos la variable de entorno VITE_API_URL que Vercel nos proporciona.
// Esta es la forma estándar y segura de acceder a ellas en un proyecto de Vite.
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Una función 'fetch' personalizada que centraliza la lógica de las llamadas a nuestra API.
 * 1. Lee la URL base desde las variables de entorno.
 * 2. Automáticamente añade el token de autenticación si existe.
 * 3. Maneja errores comunes y respuestas de la API.
 * @param {string} endpoint - La ruta específica a la que llamar (ej. '/auth/login').
 * @param {object} options - Opciones estándar de fetch (method, body, etc.).
 * @returns {Promise<any>} La respuesta de la API en formato JSON.
 */
const apiFetch = async (endpoint, options = {}) => {
  // Primero, verificamos si la variable de entorno está configurada.
  // Si no lo está, fallamos de inmediato con un error claro en la consola.
  if (!API_URL) {
    const errorMessage = "¡Configuración Faltante! La variable de entorno VITE_API_URL no está definida en el entorno de despliegue (Vercel).";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Obtenemos el token guardado en el navegador.
  const token = localStorage.getItem('token');

  // Configuramos las cabeceras por defecto.
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Si hay un token, lo añadimos a la cabecera 'x-auth-token'.
  if (token) {
    headers['x-auth-token'] = token;
  }

  try {
    // Construimos la URL completa y realizamos la petición.
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Si el servidor nos dice que no estamos autorizados (token inválido o expirado).
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Forzamos la redirección al login.
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
    }

    // Si la respuesta no fue exitosa (ej. 400, 404, 500).
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ocurrió un error inesperado.');
    }
    
    // Algunas respuestas exitosas (como DELETE) pueden no tener cuerpo.
    if (response.status === 204) {
      return null;
    }

    // Si todo fue bien, devolvemos los datos.
    return response.json();

  } catch (error) {
    // Si el fetch falla por un problema de red (como ERR_CONNECTION_REFUSED),
    // lanzamos un error más amigable.
    if (error instanceof TypeError) { // TypeError suele indicar un problema de red
        console.error("Error de red:", error);
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }
    // Si es otro tipo de error, simplemente lo relanzamos.
    throw error;
  }
};

export default apiFetch;