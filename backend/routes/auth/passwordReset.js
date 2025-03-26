// routes/auth/passwordReset.js

import express from 'express';
import { body } from 'express-validator';
import { handlePasswordResetRequest , processPasswordReset  } from '../../controllers/auth/passwordResetController.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimit.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Ruta para solicitar el restablecimiento de contraseña
router.post(
  '/request',
  verifyToken,
  authLimiter,  
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
  ],
  handlePasswordResetRequest 
);

// Ruta para confirmar el restablecimiento de contraseña
router.post(
    '/confirm',
    verifyToken,
    [
      body('token').notEmpty().withMessage('El token es obligatorio'),
      body('newPassword')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
        .matches(/[^a-zA-Z0-9]/).withMessage('La contraseña debe contener al menos un carácter especial'),
    ],
    processPasswordReset
  );

export default router;
