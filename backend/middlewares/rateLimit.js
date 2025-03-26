// middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Límite de peticiones
  message: 'Demasiados intentos, por favor intente más tarde'
});

// Usar en rutas sensibles
// router.post('/login', authLimiter, [...validations], login);
// router.post('/reset-password-request', authLimiter, [...validations], resetPasswordRequest);