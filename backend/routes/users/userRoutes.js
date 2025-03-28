// routes/auth/userRoutes.js

import express from 'express';
import { body } from 'express-validator';
import { login, activateUserAccount } from '../../controllers/users/userController.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimit.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Validaciones para el login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  login
);

router.post(
  '/activate-account',
  verifyToken,
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('idcliente').notEmpty().withMessage('El id de clinte es obligatorio'),
  ],
  activateUserAccount
);
 
export default router;


