// controllers/users/userController.js

import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../../models/users/Users.js';
import PasswordResetToken from '../../models/auth/PasswordResetToken.js';
import ClienteWinet from '../../models/clients/ClienteWinetModel.js';
import UserSession from '../../models/users/UserSession.js';  
import logger from '../../utils/logger.js';

// Función para generar access token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Función para generar refresh token y guardarlo en BD
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // Asumiendo que el modelo RefreshToken ya está configurado para manejar esto
  await PasswordResetToken.create({ user_id: user.id, token: refreshToken, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  return refreshToken;
};

// 🔑 LOGIN
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    // Verificar si la cuenta está activa
    if (!user.is_active) {
      return res.status(403).json({ message: 'La cuenta no está activa. Por favor, activa tu cuenta.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

     // Crear sesión de usuario
     await UserSession.create({
      user_id: user.id,
      token: refreshToken, // o accessToken según tu implementación
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      is_active: true
    });

    logger.info(`Inicio de sesión: ${email}`);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    logger.error(`Error en login: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para manejar el logout
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token requerido' });
  }

  try {
    // Verificar si el refresh token existe en la base de datos
    const tokenExists = await PasswordResetToken.findOne({ where: { token: refreshToken } });
    if (!tokenExists) {
      return res.status(400).json({ message: 'Refresh token no válido' });
    }

    // Invalidar la sesión
    await UserSession.update(
      { is_active: false },
      { where: { token: refreshToken } }
    );

    // Invalidar el refresh token eliminando el registro de la base de datos
    await tokenExists.destroy();

    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    logger.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Activar cuenta de usuario con idcliente
export const activateUserAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, idcliente } = req.body;

  try {
    // 1. Buscar el usuario por correo electrónico
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

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
      idcliente: idcliente,
      nombre: clienteData.nombre,
      estado: clienteData.estado, // Mapear el estado
      correo: email || '',
      telefono: clienteData.telefono,
      movil: clienteData.movil,
      cedula: clienteData.cedula,
      pasarela: clienteData.pasarela || '',
      codigo: clienteData.codigo,
      direccion_principal: clienteData.direccion_principal,
    };

    // 7. Crear el cliente en la tabla clientes_winet
    const nuevoCliente = await ClienteWinet.create(clienteWinetData);
    logger.info('Cliente creado:', { cliente: nuevoCliente });

    // 8. Activar activate_account
    user.activate_account = true;
    await user.save();

    res.json({
      message: 'Cuenta activada con éxito. Cliente creado.',
      cliente: nuevoCliente,
    });
  } catch (error) {
    logger.error(`Error al activar la cuenta: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



