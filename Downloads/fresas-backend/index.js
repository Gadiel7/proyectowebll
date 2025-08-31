const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const usuarioRoutes = require('./routes/usuarios');
const pedidoRoutes = require('./routes/pedidos');
const productoRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURACIÓN DE CORS MEJORADA ---
// Lista de dominios permitidos (los que pueden hablar con nuestra API)
const whitelist = [
    'https://proyectowebll.vercel.app', // URL principal de producción
    // Expresión regular para permitir CUALQUIER subdominio de Vercel
    // Esto cubrirá la URL de previsualización que me pasaste y futuras previsualizaciones.
    new RegExp(`^https:\/\/proyectowebll-.*-gadielfox123-gmailcoms-projects\.vercel\.app$`)
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin 'origin' (como las de apps móviles o Postman/Thunder Client)
        if (!origin) return callback(null, true);

        // Si el origen de la petición está en nuestra lista blanca, permitirlo
        if (whitelist.some(url => url instanceof RegExp ? url.test(origin) : url === origin)) {
            callback(null, true);
        } else {
            // Si no está en la lista, rechazarlo
            callback(new Error('No permitido por CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// -----------------------------------------

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));
  
app.get('/', (req, res) => {
  res.send('API de Fresas con Crema funcionando!');
});

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});