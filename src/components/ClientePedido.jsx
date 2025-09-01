import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import './ClientePedido.css';

const API_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const productosData = {
    tamanos: [
        // --- RUTAS DE IMAGEN CORREGIDAS ---
        { id: 'vaso-pequeno', nombre: 'Pequeño (12 oz)', valor: 'pequeno', precio: 10.00, imagen: '/images/foto1.jpg' },
        { id: 'vaso-mediano', nombre: 'Mediano (16 oz)', valor: 'mediano', precio: 18.00, imagen: '/images/foto3.jpg' },
        { id: 'vaso-grande', nombre: 'Grande (20 oz)', valor: 'grande', precio: 25.00, imagen: '/images/foto2.jpg' }
    ],
    cremas: [
        { nombre: 'Crema Batida Clásica', valor: 'crema-batida', precio: 0.00 },
        { nombre: 'Crema de Leche Condensada', valor: 'crema-de-leche', precio: 0.00 },
        { nombre: 'Crema de Oreo', valor: 'crema-de-oreo', precio: 0.00 }
    ],
    frutas: [
        { id: 'fruta-fresas', nombre: 'Fresas', valor: 'fresas', precio: 0.00, imagen: 'https://img.freepik.com/foto-gratis/bayas-fresa-levitando-sobre-fondo-blanco_485709-57.jpg?semt=ais_hybrid&w=740&q=80' },
        { id: 'fruta-banano', nombre: 'Banano', valor: 'banano', precio: 0.00, imagen: 'https://fruverhome.co/wp-content/uploads/2020/08/Banano.jpg.webp' },
        { id: 'fruta-durazno', nombre: 'Durazno', valor: 'durazno', precio: 0.00, imagen: 'https://png.pngtree.com/png-clipart/20240418/original/pngtree-peach-fruits-and-slices-peach-png-image_14884190.png' }
    ],
    toppings: [
        { id: 'topping-chispas', nombre: 'Chispas de Chocolate', valor: 'chispas-chocolate', precio: 2.00, imagen: 'https://listonic.com/phimageproxy/listonic/products/chocolate_chips.webp' },
        { id: 'topping-leche-en-polvo', nombre: 'Leche en Polvo', valor: 'leche-en-polvo', precio: 2.00, imagen: 'https://s.alicdn.com/@sc04/kf/A6b25d854eeb24778a382e2ab4c148f95x/Wholesale-Price-Instant-Full-Whole-Milk-Powder-for-Sale.jpg_300x300.jpg' },
        { id: 'topping-nuez', nombre: 'Nuez', valor: 'nuez', precio: 2.00, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ5-oUxqLT2WgP8bV4wb2iabEkbqYUEtHl2g&s' }
    ]
};

export default function ClientePedido() {
    const { user, logout, createPedido, isSubmitting } = useAppContext();
    
    const [tamano, setTamano] = useState(productosData.tamanos[0]);
    const [crema, setCrema] = useState(productosData.cremas[0]);
    const [frutasSeleccionadas, setFrutasSeleccionadas] = useState([]);
    const [toppingsSeleccionados, setToppingsSeleccionados] = useState([]);
    const [precioTotal, setPrecioTotal] = useState(0.00);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const socket = io(API_BASE_URL);
        if (user?.id) {
            socket.emit('join_room', user.id);
        }
        socket.on('pedido_actualizado', (pedidoActualizado) => {
            if (pedidoActualizado.estado === 'Listo para entregar') {
                setNotification(`¡Buenas noticias! Tu pedido de ${pedidoActualizado.tamano} está listo para recoger.`);
            }
        });
        return () => {
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        let total = 0;
        total += tamano.precio;
        total += crema.precio;
        frutasSeleccionadas.forEach(fruta => total += fruta.precio);
        toppingsSeleccionados.forEach(topping => total += topping.precio);
        setPrecioTotal(total);
    }, [tamano, crema, frutasSeleccionadas, toppingsSeleccionados]);

    const handleCheckboxChange = (item, lista, setLista) => {
        const isSelected = lista.some(i => i.valor === item.valor);
        if (isSelected) {
            setLista(lista.filter(i => i.valor !== item.valor));
        } else {
            setLista([...lista, item]);
        }
    };

    const handleRealizarPedido = async () => {
        const pedidoData = {
            tamano: tamano.nombre,
            crema: crema.nombre,
            frutas: frutasSeleccionadas.map(f => f.nombre),
            toppings: toppingsSeleccionados.map(t => t.nombre),
            precioTotal,
        };
        
        const success = await createPedido(pedidoData);
        if (success) {
            setTamano(productosData.tamanos[0]);
            setCrema(productosData.cremas[0]);
            setFrutasSeleccionadas([]);
            setToppingsSeleccionados([]);
        }
    };

    return (
        <div className="cliente-pedido-page">
            {notification && (
                <div className="notification-banner">
                    <p>{notification}</p>
                    <button onClick={() => setNotification(null)}>&times;</button>
                </div>
            )}
            
            <header>
                <img src="https://st2.depositphotos.com/1030956/5873/v/450/depositphotos_58731767-stock-illustration-red-illustrated-strawberry-vector-ecology.jpg" alt="Logo de SweetBerry" className="logo" />
                <h1>Bienvenido, {user?.nombre}!</h1>
                <p>¡Crea tu vaso de fresas con crema soñado!</p>
                <button onClick={logout} className="btn btn-logout-cliente">Cerrar Sesión</button>
            </header>

            <div className="main-content">
                <main>
                    <form id="order-form">
                        <div className="form-section">
                            <h3>1. Elige el Tamaño</h3>
                            <div className="opciones-grid">
                                {productosData.tamanos.map(item => (
                                    <label htmlFor={item.id} className="opcion-item" key={item.id}>
                                        <input type="radio" id={item.id} name="tamano-vaso" value={item.valor} checked={tamano.valor === item.valor} onChange={() => setTamano(item)} />
                                        <span>{item.nombre}</span>
                                        <div className="img-container"><img src={item.imagen} alt={item.nombre} /></div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>2. Escoge tu Crema</h3>
                            <select id="tipo-crema" name="tipo-crema" className="form-control" value={crema.valor} onChange={(e) => setCrema(productosData.cremas.find(c => c.valor === e.target.value))}>
                                {productosData.cremas.map(item => (
                                    <option key={item.valor} value={item.valor} data-price={item.precio}>{item.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <h3>3. Agrega Frutas Frescas</h3>
                            <div className="opciones-grid">
                                {productosData.frutas.map(item => (
                                    <label htmlFor={item.id} className="opcion-item" key={item.id}>
                                        <input type="checkbox" id={item.id} name="fruta" value={item.valor} checked={frutasSeleccionadas.some(f => f.valor === item.valor)} onChange={() => handleCheckboxChange(item, frutasSeleccionadas, setFrutasSeleccionadas)} />
                                        <span>{item.nombre}</span>
                                        <div className="img-container"><img src={item.imagen} alt={item.nombre} /></div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>4. El Toque Final: ¡Toppings!</h3>
                            <div className="opciones-grid">
                                {productosData.toppings.map(item => (
                                    <label htmlFor={item.id} className="opcion-item" key={item.id}>
                                        <input type="checkbox" id={item.id} name="topping" value={item.valor} checked={toppingsSeleccionados.some(t => t.valor === item.valor)} onChange={() => handleCheckboxChange(item, toppingsSeleccionados, setToppingsSeleccionados)} />
                                        <span>{item.nombre}</span>
                                        <div className="img-container"><img src={item.imagen} alt={item.nombre} /></div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>
                </main>

                <aside className="sidebar">
                    <div className="sidebar-ad-box">
                        <h4>¡Oferta Especial!</h4>
                        {/* --- RUTA DE IMAGEN CORREGIDA --- */}
                        <img src="/images/post.png" alt="Publicidad de Batido de Fresa" />
                        <p>Prueba nuestro nuevo batido de fresa y vainilla. ¡Refrescante y delicioso!</p>
                        <a href="#" className="btn btn-sidebar">Ver más</a>
                    </div>
                    <div className="sidebar-photo-box">
                        {/* --- RUTA DE IMAGEN CORREGIDA --- */}
                        <img src="/images/oferta.png" alt="Foto decorativa de fresas" />
                    </div>
                </aside>
            </div>

            <div className="footer-actions">
                <div className="total-price-container">Total: <span>Bs <span>{precioTotal.toFixed(2)}</span></span></div>
                <div className="action-buttons">
                    <button id="realizar-pedido-btn" className="btn btn-pedido" onClick={handleRealizarPedido} disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando Pedido...' : 'Realizar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
}