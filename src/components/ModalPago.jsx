// src/components/ModalPago.jsx
import './ModalPago.css';

export default function ModalPago({ isOpen, onClose, whatsappLink }) {
  if (!isOpen) {
    return null; // No renderizar nada si el modal está cerrado
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h3>Completa tu Pedido</h3>
        <p>1. Escanea el código QR para realizar el pago.</p>
        <div className="qr-code-container">
          <img src="/images/qr.jpg" alt="Código QR para pago" />
        </div>
        <p>2. Envía tu comprobante de pago por WhatsApp.</p>
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-whatsapp"
        >
          Enviar Comprobante
        </a>
      </div>
    </div>
  );
}