// src/components/ClienteDashboard.jsx
import { useAppContext } from "../context/AppContext";

export default function ClienteDashboard() {
    const { user, logout } = useAppContext();

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        background: '#f4f4f4',
        fontFamily: 'Arial, sans-serif'
    };

    return (
        <div style={containerStyle}>
            <h1>¡Bienvenido, {user?.name || 'Cliente'}!</h1>
            <p>Aquí irá la interfaz para que puedas hacer tus pedidos.</p>
            <p><em>(Frontend de cliente en construcción)</em></p>
            <button onClick={logout} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Cerrar Sesión</button>
        </div>
    );
}