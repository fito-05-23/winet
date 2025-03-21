// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import logger from '../utils/logger.js';

// Función para generar access token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Función para generar refresh token y guardarlo en BD
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  await pool.query('INSERT INTO refresh_tokens (user_id, token) VALUES (\$1, \$2)', [user.id, refreshToken]);
  return refreshToken;
};

// 📝 REGISTRO
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, role_id = 2 } = req.body; // Asumiendo que el rol 'user' tiene id 2

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
    if (userExists.rows.length) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, name, role_id, is_active) VALUES (\$1, \$2, \$3, \$4, \$5) RETURNING *',
      [email, hashedPassword, name, role_id, false] // is_active = false
    );

    // Generar un código de activación de 6 dígitos
    const activationCode = Math.floor(100000 + Math.random() * 900000); // Número entre 100000 y 999999

    // Guardar el código en la base de datos
    await pool.query(
      'INSERT INTO activation_codes (user_id, code) VALUES (\$1, \$2)',
      [newUser.rows[0].id, activationCode]
    );

    logger.info(`Nuevo usuario registrado: ${email}`);
    res.status(201).json({
      message: 'Usuario registrado con éxito. Usa el código de activación para activar tu cuenta.',
      activationCode, // Devuelve el código de activación en la respuesta
    });
  } catch (error) {
    logger.error(`Error en registro: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const activateAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, code } = req.body;

  try {
    // Buscar el usuario por correo electrónico
    const userResult = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // Buscar el código de activación
    const codeResult = await pool.query(
      'SELECT * FROM activation_codes WHERE user_id = \$1 AND code = \$2',
      [user.id, code]
    );

    if (!codeResult.rows.length) {
      return res.status(400).json({ message: 'Código de activación inválido' });
    }

    // Activar la cuenta
    await pool.query('UPDATE users SET is_active = TRUE WHERE id = \$1', [user.id]);

    // Eliminar el código de activación
    await pool.query('DELETE FROM activation_codes WHERE user_id = \$1', [user.id]);

    res.json({ message: 'Cuenta activada con éxito' });
  } catch (error) {
    logger.error(`Error al activar la cuenta: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 🔑 LOGIN
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
    if (!userResult.rows.length) return res.status(400).json({ message: 'Usuario no encontrado' });

    const user = userResult.rows[0];

    // Verificar si la cuenta está activa
    if (!user.is_active) {
      return res.status(403).json({ message: 'La cuenta no está activa. Por favor, activa tu cuenta.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    logger.info(`Inicio de sesión: ${email}`);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    logger.error(`Error en login: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 🔄 REFRESCAR TOKEN
export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const tokenExists = await pool.query('SELECT * FROM refresh_tokens WHERE token = \$1', [token]);
    if (!tokenExists.rows.length) return res.status(403).json({ message: 'Refresh Token inválido' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

    res.json({ accessToken });
  } catch (error) {
    logger.error('Error al refrescar el token');
    res.status(403).json({ message: 'Refresh Token inválido' });
  }
};