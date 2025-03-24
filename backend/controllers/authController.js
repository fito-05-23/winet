// controllers/authController.js
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import ClienteWinet from '../models/ClienteWinetModel.js';
import logger from '../utils/logger.js';

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

// 📝 REGISTRO
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, role_id = 2 } = req.body; // Asumiendo que el rol 'user' tiene id 2

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      name,
      role_id,
      is_active: false,
      activate_account: false,
    });

    // Generar un código de activación de 6 dígitos
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Convertir a string

    // Guardar el código en la base de datos
    await PasswordResetToken.create({
      user_id: newUser.id,
      token: activationCode,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    });

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

// Activar cuenta con código de activación
export const activateAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, code } = req.body;

  try {
    // Buscar el usuario por correo electrónico
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar el código de activación
    const activationToken = await PasswordResetToken.findOne({
      where: { user_id: user.id, token: code },
    });

    if (!activationToken) {
      return res.status(400).json({ message: 'Código de activación inválido' });
    }

    // Activar la cuenta
    user.is_active = true;
    await user.save();

    // Eliminar el código de activación
    await activationToken.destroy();

    res.json({ message: 'Cuenta activada con éxito' });
  } catch (error) {
    logger.error(`Error al activar la cuenta: ${error.message}`);
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
      nombre: clienteData.nombre,
      estado: clienteData.estado === 'RETIRADO' ? 'inactivo' : 'activo', // Mapear el estado
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
    const tokenExists = await PasswordResetToken.findOne({ where: { token } });
    if (!tokenExists) return res.status(403).json({ message: 'Refresh Token inválido' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

    res.json({ accessToken });
  } catch (error) {
    logger.error('Error al refrescar el token');
    res.status(403).json({ message: 'Refresh Token inválido' });
  }
};

// Función para solicitar el restablecimiento de contraseña
export const resetPasswordRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear un token de restablecimiento de contraseña
    const token = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });
    await PasswordResetToken.create({ user_id: user.id, token, expires_at: new Date(Date.now() + 3600000) });

    // Aquí es donde normalmente enviarías un correo electrónico al usuario.
    // Dado que no estás utilizando un servidor de correo, puedes devolver el token en la respuesta.
    // En un entorno de producción, evita devolver el token directamente.

    res.json({ message: 'Solicitud de restablecimiento de contraseña enviada. Revisa tu correo electrónico.', token });
  } catch (error) {
    logger.error('Error en la solicitud de restablecimiento de contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para confirmar el restablecimiento de contraseña
export const resetPasswordConfirm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, newPassword } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el token existe y no ha expirado
    const resetToken = await PasswordResetToken.findOne({ where: { token, user_id: user.id } });
    if (!resetToken) {
      return res.status(400).json({ message: 'Token de restablecimiento de contraseña inválido o expirado' });
    }

    // Actualizar la contraseña
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Eliminar el token de restablecimiento
    await resetToken.destroy();

    res.json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    logger.error('Error en la confirmación de restablecimiento de contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};