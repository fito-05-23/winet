// controllers/authController.js
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import logger from '../utils/logger.js';
import { createClienteWinet } from '../models/clienteWinetModel.js'; // Importar el modelo

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

export const activateUserAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, idcliente } = req.body;

  try {
    // 1. Buscar el usuario por correo electrónico
    const userResult = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // 2. Verificar si el usuario ya tiene activate_account = TRUE
    if (user.activate_account) {
      return res.status(400).json({ message: 'La cuenta ya está activada.' });
    }

    // 3. Realizar la consulta a la API de MikroSystem
    const url = `${process.env.MIKROSYSTEM_API}${process.env.DETAILS_CLIENTS}`;
    logger.info(`Consultando API de MikroSystem: ${url}`);

    const response = await axios.post(
      url,
      {
        token: process.env.TOKEN_MIKROSYSTEM, // Token desde las variables de entorno
        idcliente, // idcliente desde el body de la solicitud
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    logger.info('Respuesta de MikroSystem:', { data: response.data });

    // 4. Verificar si la respuesta de MikroSystem es exitosa
    if (response.data.estado !== 'exito') {
      return res.status(400).json({ message: 'No se pudo activar la cuenta. Verifique el idcliente.' });
    }

    // 5. Obtener los datos del cliente de la respuesta de MikroSystem
    const clienteData = response.data.datos[0];

    // 6. Mapear los datos de MikroSystem a la estructura de clientes_winet
    const clienteWinetData = {
      id_user: user.id, // ID del usuario
      nombre: clienteData.nombre,
      estado: clienteData.estado === 'RETIRADO' ? 'inactivo' : 'activo', // Mapear el estado
      correo: email || '', // Si no hay correo, usar cadena vacía
      telefono: clienteData.telefono,
      movil: clienteData.movil,
      cedula: clienteData.cedula,
      pasarela: clienteData.pasarela || '', // Si no hay pasarela, usar cadena vacía
      codigo: clienteData.codigo,
      direccion_principal: clienteData.direccion_principal,
    };

    // 7. Crear el cliente en la tabla clientes_winet
    const nuevoCliente = await createClienteWinet(clienteWinetData);
    logger.info('Cliente creado:', { cliente: nuevoCliente });

    // 8. Activar activate_account
    await pool.query('UPDATE users SET activate_account = TRUE WHERE id = \$1', [user.id]);

    res.json({
      message: 'Cuenta activada con éxito. Cliente creado.',
      cliente: nuevoCliente,
    });
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