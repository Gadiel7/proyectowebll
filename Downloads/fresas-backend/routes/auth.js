// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// --- RUTA DE REGISTRO ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // 1. Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ correo });
    if (usuario) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // 2. Crear un nuevo usuario con los datos
    usuario = new Usuario({ nombre, correo, password, rol });

    // 3. Hashear (encriptar) la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    // 4. Guardar el usuario en la base de datos
    await usuario.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});


// --- RUTA DE LOGIN ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // 2. Comparar la contraseña enviada con la guardada (hasheada)
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Si todo es correcto, crear y firmar un JSON Web Token (JWT)
    const payload = {
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Necesitaremos esta "palabra secreta"
      { expiresIn: '1h' }, // El token expira en 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Enviamos el token al cliente
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;