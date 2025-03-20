// routes/auth.js
import express from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken } from '../controllers/authController.js';

const router = express.Router();

// Validaciones para el registro
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Rol inválido'),
  ],
  register
);

// Validaciones para el login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  login
);

router.post('/refresh', refreshToken);

export default router;



