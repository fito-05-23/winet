// stores/storesRoutes.js
import express from "express";
import { body, param } from "express-validator";
import {
  registrarPago,
  obtenerPagosCliente,
  obtenerDetallePago,
} from "../../controllers/stores/paymentController.js";
import { verifyToken } from "../../middlewares/auth.js";
import {
  verifyClientStatus,
  verifyStoreOwnership,
  verifyClientOwnership,
} from "../../middlewares/storeAccess.js";
import { secureActivityLogger } from "../../middlewares/activityLogger.js";
import { authLimiter } from "../../middlewares/rateLimit.js";

const router = express.Router();

// Middleware común para todas las rutas
router.use(verifyToken);
router.use(verifyClientStatus);

// Rutas de pagos
router.post(
  "/",
  [
    body("id_tienda")
      .isInt()
      .withMessage("ID de tienda debe ser un número entero"),
    body("id_cliente")
      .isInt()
      .withMessage("ID de cliente debe ser un número entero"),
    body("monto")
      .isDecimal({ min: 0.01 })
      .withMessage("Monto debe ser un número positivo mayor a 0.01"),
  ],
  verifyStoreOwnership, // Verifica que el usuario sea dueño de la tienda
  secureActivityLogger,
  registrarPago
);

router.get(
  "/cliente/:id_cliente",
  [
    param("id_cliente")
      .isInt()
      .withMessage("ID de cliente debe ser un número entero"),
  ],
  verifyClientOwnership, // Solo el propio cliente o admin puede ver sus pagos
  secureActivityLogger,
  obtenerPagosCliente
);

//router.get("/tiendas", secureActivityLogger, obtenerPagosTiendas);

router.get(
  "/:id_pago",
  [
    param("id_pago")
      .isInt()
      .withMessage("ID de pago debe ser un número entero"),
  ],
  secureActivityLogger,
  obtenerDetallePago
);

export default router;
