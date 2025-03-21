// routes/auth.js
import express from 'express';
import { body } from 'express-validator';
import { register, login, activateAccount, activateUserAccount, refreshToken } from '../controllers/authController.js';
import { verifyToken, checkRole } from '../middlewares/auth.js';
import logger from '../utils/logger.js';
import pool from '../config/db.js'; // Importa pool

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

// Validaciones para el login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  login
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

router.post(
  '/activate-account',
  verifyToken,
  checkRole(['admin', 'user', 'operador']),
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('idcliente').notEmpty().withMessage('El id de clinte es obligatorio'),
  ],
  activateUserAccount
);

router.post('/refresh', refreshToken);

// Ruta Protegida /perfil
router.get(
    '/perfil',
    verifyToken,
    checkRole(['admin', 'user', 'operador']),
    async (req, res) => {
      try {
        const userId = req.user.id;

        const userResult = await pool.query('SELECT * FROM users WHERE id = \$1', [userId]);
        if (!userResult.rows.length) return res.status(404).json({ message: 'Usuario no encontrado' });
  
        const user = userResult.rows[0];
        const userInfo = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
  
        res.json({ user: userInfo });
      } catch (error) {
        logger.error(`Error al obtener el perfil del usuario: ${error.message}`);
        res.status(500).json({ message: 'Error en el servidor' });
      }
    }
  );
  
export default router;


