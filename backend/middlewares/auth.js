// /middlewares/auth.js
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import User from '../models/users/Users.js';  // Asegúrate de que ambos modelos estén exportados
import Role from '../models/security/Roles.js';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    logger.warn('Acceso denegado. No hay token.', { headers: req.headers });
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Asegurarnos que el token tenga los datos mínimos requeridos
    if (!decoded.id) {
      logger.warn('Token no contiene ID de usuario', { decoded });
      return res.status(401).json({ message: 'Token inválido: falta ID de usuario' });
    }

    // Guardar datos relevantes en req.user
    req.user = {
      id: decoded.id,
      role: decoded.role,
      // Agrega otros campos necesarios
    };
    
    logger.debug('Token verificado correctamente', { userId: decoded.id });
    next();
  } catch (error) {
    logger.error('Error al verificar token', {
      error: error.message,
      token: token.substring(0, 10) + '...' // Log parcial del token por seguridad
    });
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
        as: "role",  // 🔥 Debe coincidir con el alias cambiado
        attributes: ["name"],
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
