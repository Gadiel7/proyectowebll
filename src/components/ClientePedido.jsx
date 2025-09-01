import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
// Importamos el CSS como un módulo, lo que aísla sus estilos
import styles from './ClientePedido.module.css';

// Datos de los productos
const productosData = {
    tamanos: [
        { id: 'vaso-pequeno', nombre: 'Pequeño (12 oz)', valor: 'pequeno', precio: 10.00, imagen: '/images/vaso pequeño.png' },
        { id: 'vaso-mediano', nombre: 'Mediano (16 oz)', valor: 'mediano', precio: 18.00, imagen: '/images/vaso mediano.png' },
        { id: 'vaso-grande', nombre: 'Grande (20 oz)', valor: 'grande', precio: 25.00, imagen: '/images/vaso grande.png' }
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
            tamano: tamano.nombre, // Enviamos el nombre legible
            crema: crema.nombre,
            frutas: frutasSeleccionadas.map(f => f.nombre),
            toppings: toppingsSeleccionados.map(t => t.nombre),
            precioTotal,
        };
        
        const success = await createPedido(pedidoData);
        if (success) {
            // Reseteamos el formulario al estado inicial
            setTamano(productosData.tamanos[0]);
            setCrema(productosData.cremas[0]);
            setFrutasSeleccionadas([]);
            setToppingsSeleccionados([]);
        }
    };

    return (
        <div className={styles.container}>
            <header>
                <img src="https://st2.depositphotos.com/1030956/5873/v/450/depositphotos_58731767-stock-illustration-red-illustrated-strawberry-vector-ecology.jpg" alt="Logo de SweetBerry" className={styles.logo} />
                <h1>Bienvenido, {user?.nombre}!</h1>
                <p>¡Crea tu vaso de fresas con crema soñado!</p>
                {/* Botón de Logout añadido para el cliente */}
                <button onClick={logout} className={`${styles.btn} ${styles['btn-logout-cliente']}`}>Cerrar Sesión</button>
            </header>

            <div className={styles['main-content']}>
                <main>
                    <form id="order-form">
                        <div className={styles['form-section']}>
                            <h3>1. Elige el Tamaño</h3>
                            <div className={styles['opciones-grid']}>
                                {productosData.tamanos.map(item => (
                                    <label htmlFor={item.id} className={styles['opcion-item']} key={item.id}>
                                        <input type="radio" id={item.id} name="tamano-vaso" value={item.valor} checked={tamano.valor === item.valor} onChange={() => setTamano(item)} />
                                        <span>{item.nombre}</span>
                                        <div className={styles['img-container']}><img src={item.imagen} alt={item.nombre} /></div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles['form-section']}>
                            <h3>2. Escoge tu Crema</h3>
                            <select id="tipo-crema" name="tipo-crema" className={styles['form-control']} value={crema.valor} onChange={(e) => setCrema(productosData.cremas.find(c => c.valor === e.target.value))}>
                                {productosData.cremas.map(item => (
                                    <option key={item.valor} value={item.valor} data-price={item.precio}>{item.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles['form-section']}>
                            <h3>3. Agrega Frutas Frescas</h3>
                            <div className={styles['opciones-grid']}>
                                {productosData.frutas.map(item => (
                                    <label htmlFor={item.id} className={styles['opcion-item']} key={item.id}>
                                        <input type="checkbox" id={item.id} name="fruta" value={item.valor} checked={frutasSeleccionadas.some(f => f.valor === item.valor)} onChange={() => handleCheckboxChange(item, frutasSeleccionadas, setFrutasSeleccionadas)} />
                                        <span>{item.nombre}</span>
                                        <div className={styles['img-container']}><img src={item.imagen} alt={item.nombre} /></div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles['form-section']}>
                            <h3>4. El Toque Final: ¡Toppings!</h3>
                            <div className={styles['opciones-grid']}>
                                {productosData.toppings.map(item => (
                                    <label htmlFor={item.id} className={styles['opcion-item']} key={item.id}>
                                        <input type="checkbox" id={item.id} name="topping" value={item.valor} checked={toppingsSeleccionados.some(t => t.valor === item.valor)} onChange={() => handleCheckboxChange(item, toppingsSeleccionados, setToppingsSeleccionados)} />
                                        <span>{item.nombre}</span>
                                        <div className={styles['img-container']}><img src={item.imagen} alt={item.nombre} /></div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>
                </main>

                <aside className={styles.sidebar}>
                    <div className={styles['sidebar-ad-box']}>
                        <h4>¡Oferta Especial!</h4>
                        <img src="/images/post.png" alt="Publicidad de Batido de Fresa" />
                        <p>Prueba nuestro nuevo batido de fresa y vainilla. ¡Refrescante y delicioso!</p>
                        <a href="#" className={`${styles.btn} ${styles['btn-sidebar']}`}>Ver más</a>
                    </div>
                    <div className={styles['sidebar-photo-box']}>
                        <img src="/images/oferta.png" alt="Foto decorativa de fresas" />
                    </div>
                </aside>
            </div>

            <div className={styles['footer-actions']}>
                <div className={styles['total-price-container']}>Total: <span id="total-price">Bs <span id="price-value">{precioTotal.toFixed(2)}</span></span></div>
                <div className={styles.action-buttons}>
                    <button id="realizar-pedido-btn" className={`${styles.btn} ${styles['btn-pedido']}`} onClick={handleRealizarPedido} disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando Pedido...' : 'Realizar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
}