// routes/profile/profileRoutes.js
import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { verifyClientStatus } from '../../middlewares/storeAccess.js';
import { getUserProfile } from '../../controllers/clients/clientController.js';
import { authLimiter } from '../../middlewares/rateLimit.js';

const router = express.Router();

// Ruta para obtener el perfil del cliente
router.get(
  "/perfil",
  authLimiter,       // Opcional: límite de tasa
  verifyToken,       // 1. Verifica el token JWT
  verifyClientStatus, // 2. Verifica el estado del cliente
  getUserProfile     // 3. Obtiene el perfil del cliente
);

export default router;