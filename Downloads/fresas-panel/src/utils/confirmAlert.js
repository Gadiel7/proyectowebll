import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Muestra un modal de confirmación bonito usando SweetAlert2.
 * @param {string} title - El título del modal (ej. '¿Estás seguro?').
 * @param {string} text - El texto descriptivo del modal.
 * @returns {Promise<any>} - Una promesa que se resuelve con el resultado de la interacción del usuario.
 */
const confirmAlert = (title, text) => {
  return MySwal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, ¡estoy seguro!',
    cancelButtonText: 'Cancelar',
    // Estilos personalizados para que se vea más moderno
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel',
    },
  });
};

export default confirmAlert;