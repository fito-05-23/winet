// stores/storesRoutes.js   

import express from 'express';
import { body, param } from 'express-validator';
import { 
  obtenerTodasLasTiendas,
  crearTienda, 
  obtenerTiendasPorCliente, 
  actualizarTienda, 
  eliminarTienda 
} from '../../controllers/stores/storeController.js';
import { verifyToken } from '../../middlewares/auth.js';
import { 
  verifyClientStatus, 
  verifyStoreOwnership,
  verifyClientOwnership 
} from '../../middlewares/storeAccess.js';
import { authLimiter } from '../../middlewares/rateLimit.js';

const router = express.Router();

// Ruta pública para obtener todas las tiendas (sin autenticación)
router.get('/public/all', authLimiter, obtenerTodasLasTiendas);

// Middleware común para todas las rutas
router.use(verifyToken);

// Crear nueva tienda (solo clientes activos)
router.post(
  '/',
  [
    body('nombre').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('direccion').optional().isString(),
    body('telefono').optional().isString()
  ],
  verifyClientStatus,
  crearTienda
);

// Obtener tiendas por cliente (mejor protegida)
router.get(
  '/cliente/:id_cliente',
  [
    param('id_cliente').isInt().withMessage('ID de cliente debe ser un número')
  ],
  verifyClientStatus,
  verifyClientOwnership, // Nuevo middleware
  obtenerTiendasPorCliente
);

// Actualizar tienda (solo dueño)
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID de tienda debe ser un número'),
    body('nombre').optional().isLength({ min: 3 }),
    body('direccion').optional().isString(),
    body('telefono').optional().isString()
  ],
  verifyClientStatus,
  verifyStoreOwnership,
  actualizarTienda
);

// Eliminar tienda (solo dueño)
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('ID de tienda debe ser un número')
  ],
  verifyClientStatus,
  verifyStoreOwnership,
  eliminarTienda
);

export default router;