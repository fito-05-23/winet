// routes/auth/auth.js

import express from 'express';
import { body } from 'express-validator';
import { register, activateAccount, refreshToken } from '../../controllers/auth/authController.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimit.js';
import User from '../../models/users/Users.js';
import Role from '../../models/security/Roles.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Validaciones para el registro
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('role_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El role_id debe ser un número entero válido'),
  ],
  register
);

// Ruta para activar la cuenta
router.post(
  '/activate',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos'),
  ],
  activateAccount
);

router.post('/refresh', refreshToken);
 
export default router;


