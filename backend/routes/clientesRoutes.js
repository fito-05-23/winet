// routes/clients.js
import express from 'express';
import clientController from '../controllers/clientController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'Usa POST para consultar el estado de un cliente',
    example: { token: 'Smx2SVdkbUZIdjlCUlkxdFo1cUNMQT09', idcliente: '6' }
  });
});

router.post('/', clientController.getClientStatus);

export default router;
