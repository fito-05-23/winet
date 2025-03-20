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
  // Validar errores de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, role_id = 2 } = req.body; // Asumiendo que el rol 'user' tiene id 2
  logger.info(`Nuevo usuario registrado: ${email}`);

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
    if (userExists.rows.length) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, name, role_id) VALUES (\$1, \$2, \$3, \$4) RETURNING *',
      [email, hashedPassword, name, role_id]
    );

    logger.info(`Nuevo usuario registrado: ${email}`);
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    logger.error(`Error en registro: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 🔑 LOGIN
export const login = async (req, res) => {
  // Validar errores de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
    if (!userResult.rows.length) return res.status(400).json({ message: 'Usuario no encontrado' });

    const user = userResult.rows[0];
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