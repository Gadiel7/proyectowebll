// models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true // Siempre guardar el correo en minúsculas
  },
  password: { // <-- CAMPO NUEVO
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true,
    default: 'Cliente'
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);