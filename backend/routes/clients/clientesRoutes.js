// routes/clients/clientesRoutes.js
import express from "express";
//import { clientController } from "../../controllers/clients/clientController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Usa POST para consultar el estado de un cliente",
    example: { token: "Smx2SVdkbUZIdjlCUlkxdFo1cUNMQT09", idcliente: "6" },
  });
});

export default router;
