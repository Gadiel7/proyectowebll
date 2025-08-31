const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth'); // Importar el middleware

// --- OBTENER TODOS LOS USUARIOS ---
router.get('/', auth, async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CREAR UN NUEVO USUARIO ---
// Nota: La ruta de creación de usuarios ahora está en auth/register.
// Podríamos mantener esta o eliminarla. Por ahora, la dejamos protegida.
router.post('/', auth, async (req, res) => {
  const usuario = new Usuario({
    nombre: req.body.nombre,
    correo: req.body.correo,
    password: req.body.password, // Recordar que esto no hashea la contraseña
    rol: req.body.rol
  });

  try {
    const nuevoUsuario = await usuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ACTUALIZAR UN USUARIO ---
router.put('/:id', auth, async (req, res) => {
  try {
    // Excluir la contraseña de la actualización directa por seguridad
    const { password, ...updateData } = req.body;
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!usuarioActualizado) {
        return res.status(404).json({ message: 'No se encontró el usuario' });
    }
    res.json(usuarioActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ELIMINAR UN USUARIO ---
router.delete('/:id', auth, async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'No se encontró el usuario' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;