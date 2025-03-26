// routes/auth/auth.js

import express from 'express';
import { body } from 'express-validator';
import { register, login, activateAccount, activateUserAccount, refreshToken, resetPasswordRequest, resetPasswordConfirm } from '../../controllers/auth/authController.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
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
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('idcliente').notEmpty().withMessage('El id de clinte es obligatorio'),
  ],
  activateUserAccount
);

router.post('/refresh', refreshToken);

// Ruta para solicitar el restablecimiento de contraseña
router.post(
  '/reset-password-request',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
  ],
  resetPasswordRequest
);

// Ruta para confirmar el restablecimiento de contraseña
router.post(
  '/reset-password-confirm',
  [
    body('token').notEmpty().withMessage('El token es obligatorio'),
    body('newPassword').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  resetPasswordConfirm
);

// Ruta Protegida /perfil
router.get(
  '/perfil',
  verifyToken,
  checkRole(['admin', 'user', 'operador']),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // Buscar el usuario con Sequelize e incluir el rol
      const user = await User.findOne({
        where: { id: userId },
        include: {
          model: Role,
          as: 'role',  // 🔥 Ahora coincide con la asociación
          attributes: ['name'],
        },
        attributes: ['id', 'email', 'name'],
      });     

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role ? user.role.name : null, // Si no tiene rol, se asigna null
      };

      res.json({ user: userInfo });
    } catch (error) {
      logger.error(`❌ Error al obtener el perfil del usuario: ${error.message}`);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
);
  
export default router;


