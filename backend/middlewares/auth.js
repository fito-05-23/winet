// middlewares/auth.js
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import logger from '../utils/logger.js';

export const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Acceso denegado. No hay token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos la info del usuario en `req.user`
    next();
  } catch (error) {
    logger.warn('Token inválido');
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const checkRole = (roles) => async (req, res, next) => {
  const { id } = req.user;

  try {
    const userResult = await pool.query('SELECT role_id FROM users WHERE id = \$1', [id]);
    if (!userResult.rows.length) return res.status(404).json({ message: 'Usuario no encontrado' });

    const roleId = userResult.rows[0].role_id;

    const roleResult = await pool.query('SELECT name FROM roles WHERE id = \$1', [roleId]);
    if (!roleResult.rows.length) return res.status(500).json({ message: 'Rol de usuario no encontrado' });

    const roleName = roleResult.rows[0].name;

    if (!roles.includes(roleName)) {
      return res.status(403).json({ message: 'Acceso prohibido' });
    }

    next();
  } catch (error) {
    logger.error('Error al verificar el rol');
    res.status(500).json({ message: 'Error en el servidor' });
  }
};