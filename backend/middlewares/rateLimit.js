// middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Límite de peticiones
  message: 'Demasiados intentos, por favor intente más tarde'
});
