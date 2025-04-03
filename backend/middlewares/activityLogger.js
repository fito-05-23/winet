// middlewares/activityLogger.js
import UserActivity from '../models/users/UserActivity.js';
import logger from '../utils/logger.js';

export const activityLogger = async (req, res, next) => {
  try {
    // Solo registrar actividades para rutas autenticadas
    if (req.user) {
      await UserActivity.create({
        user_id: req.user.id,
        action: `${req.method} ${req.path}`,
        details: JSON.stringify({
          params: req.params,
          body: req.body, // Considera omitir datos sensibles como contraseñas
          query: req.query
        }),
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent']
      });
    }
    next();
  } catch (error) {
    logger.error('Error registrando actividad', error);
    next(); // Continuar incluso si falla el registro de actividad
  }
};

// Versión para rutas sensibles que no deben registrar el cuerpo
export const secureActivityLogger = async (req, res, next) => {
  try {
    if (req.user) {
      await UserActivity.create({
        user_id: req.user.id,
        action: `${req.method} ${req.path}`,
        details: 'Operación sensible - detalles omitidos',
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    }
    next();
  } catch (error) {
    logger.error('Error registrando actividad segura', error);
    next();
  }
};