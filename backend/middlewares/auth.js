// /middlewares/auth.js
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import User from '../models/users/Users.js';  // Asegúrate de que ambos modelos estén exportados
import Role from '../models/security/Roles.js';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guarda el usuario en `req.user`
    next();
  } catch (error) {
    logger.warn('❌ Token inválido');
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const checkRole = (roles) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Obtener el usuario con Sequelize e incluir el rol
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        as: 'role', // Coincide con el alias en User.associate()
        attributes: ['name'],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!user.role || !roles.includes(user.role.name)) {
      return res.status(403).json({ message: 'Acceso prohibido' });
    }

    next();
  } catch (error) {
    logger.error(`❌ Error al verificar el rol: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
