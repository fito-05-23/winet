// stores/storesRoutes.js   

import express from 'express';
import { body, param } from 'express-validator';
import { 
  crearTienda, 
  obtenerTiendasPorCliente, 
  actualizarTienda, 
  eliminarTienda 
} from '../../controllers/stores/storeController.js';
import { verifyToken } from '../../middlewares/auth.js';
import { 
  verifyClientStatus, 
  verifyStoreOwnership 
} from '../../middlewares/storeAccess.js';

const router = express.Router();

// Middleware común para todas las rutas
router.use(verifyToken);

// Crear nueva tienda (solo clientes activos)
router.post(
  '/new-store',
  [
    body('id_cliente').isInt().withMessage('ID de cliente debe ser un número'),
    body('nombre').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('direccion').optional().isString(),
    body('telefono').optional().isString()
  ],
  verifyClientStatus,
  crearTienda
);

// Obtener tiendas por cliente
router.get(
  '/cliente/:id_cliente',
  [
    param('id_cliente').isInt().withMessage('ID de cliente debe ser un número')
  ],
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