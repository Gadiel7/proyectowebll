const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // Para generar el token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Usuario = require('../models/Usuario');

// ... (la ruta /register no cambia)
router.post('/register', async (req, res) => { /* ...código sin cambios... */ });

// ... (la ruta /login no cambia)
router.post('/login', async (req, res) => { /* ...código sin cambios... */ });


// --- RUTA PARA SOLICITAR RECUPERACIÓN DE CONTRASEÑA ---
// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { correo } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Por seguridad, no revelamos si el correo existe o no
            return res.status(200).json({ message: 'Si el correo está registrado, se enviará un enlace de recuperación.' });
        }

        // 1. Generar un token de reseteo seguro
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // 2. Hashear el token y guardarlo en la DB
        usuario.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        // El token expira en 10 minutos
        usuario.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

        await usuario.save();

        // 3. Crear el enlace de reseteo (asegúrate de que esta URL apunte a tu frontend)
        const resetUrl = `https://proyectowebll.vercel.app/reset-password/${resetToken}`;
        const message = `
            <h1>Has solicitado un reseteo de contraseña</h1>
            <p>Por favor, haz clic en el siguiente enlace para resetear tu contraseña:</p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>Este enlace expirará en 10 minutos.</p>
        `;

        // 4. Configurar el transportador de correo con las variables de entorno
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // 5. Enviar el correo
        await transporter.sendMail({
            from: `"Fresas con Crema" <${process.env.SMTP_USER}>`,
            to: usuario.correo,
            subject: 'Reseteo de Contraseña',
            html: message
        });

        res.status(200).json({ message: 'Correo de recuperación enviado.' });

    } catch (err) {
        console.error(err.message);
        // Limpiar los campos del token si algo falla
        if (req.body.correo) {
            const usuario = await Usuario.findOne({ correo: req.body.correo });
            if (usuario) {
                usuario.resetPasswordToken = undefined;
                usuario.resetPasswordExpire = undefined;
                await usuario.save();
            }
        }
        res.status(500).send('Error en el servidor');
    }
});


// --- RUTA PARA RESETEAR LA CONTRASEÑA CON EL TOKEN ---
// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    try {
        // Hashear el token que viene en la URL para poder compararlo con el de la DB
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // Buscar al usuario por el token y verificar que no haya expirado
        const usuario = await Usuario.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt = "greater than" (mayor que)
        });

        if (!usuario) {
            return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
        }

        // Si el token es válido, establecer la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(req.body.password, salt);
        
        // Limpiar los campos del token de reseteo
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpire = undefined;

        await usuario.save();

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});


module.exports = router;